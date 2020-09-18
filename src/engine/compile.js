import parse from "./parser";
import sortRules from "./sort";
import procedure from "../vars/procedure";
import Rules from "./general";
import { filters } from "./pseudos";
import _Array from "../vars/_Array";
import core from "../core";

const DESCENDANT_TOKEN          = { type: 'descendant' },
	  FLEXIBLE_DESCENDANT_TOKEN = { type: '_flexibleDescendant' },
	  SCOPE_TOKEN               = { type: 'pseudo', name: 'scope' },
	  PLACEHOLDER_ELEMENT       = {};

function compile( selector, options, context ) {
	const next = compileUnsafe( selector, options, context );
	return wrap( next, options );
}

function wrap( next, { adapter } ) {
	return ( elem ) => adapter.isTag( elem ) && next( elem );
}

export function compileUnsafe( selector, options, context ) {
	const token = parse( selector, options );
	return compileToken( token, options, context );
}

function includesScopePseudo( t ) {
	return ( t.type === 'pseudo' && ( t.name === 'scope' || ( _Array( t.data ) && t.data.some( ( data ) => data.some( includesScopePseudo ) ) ) ) );
}

//CSS 4 Spec (Draft): 3.3.1. Absolutizing a Scope-relative Selector
//http://www.w3.org/TR/selectors4/#absolutizing
function absolutize( token, { adapter }, context ) {
	//TODO better check if context is document
	const hasContext = !!context && !!context.length && context.every( ( e ) => e === PLACEHOLDER_ELEMENT || !!adapter.getParent( e ) );

	token.forEach( ( t ) => {
		if( t.length > 0 && isTraversal( t[ 0 ] ) && t[ 0 ].type !== 'descendant' ) {
			//don't return in else branch
		} else if( hasContext && !( _Array( t ) ? t.some( includesScopePseudo ) : includesScopePseudo( t ) ) ) {
			t.unshift( DESCENDANT_TOKEN );
		} else {
			return;
		}

		t.unshift( SCOPE_TOKEN );
	} );
}

export function compileToken( token, options, context ) {
	token = token.filter( ( t ) => t.length > 0 );

	token.forEach( sortRules );

	const isArrayContext = _Array( context );

	context = options.context || context;

	if( context && !isArrayContext ) {
		context = [ context ];
	}

	absolutize( token, options, context );

	let shouldTestNextSiblings = false;

	const query = token
		.map( ( rules ) => {
			if( rules[ 0 ] && rules[ 1 ] && rules[ 0 ].name === 'scope' ) {
				const ruleType = rules[ 1 ].type;
				if( isArrayContext && ruleType === 'descendant' ) {
					rules[ 1 ] = FLEXIBLE_DESCENDANT_TOKEN;
				} else if( ruleType === 'adjacent' || ruleType === 'sibling' ) {
					shouldTestNextSiblings = true;
				}
			}
			return compileRules( rules, options, context );
		} )
		.reduce( reduceRules, false );

	query.shouldTestNextSiblings = shouldTestNextSiblings;

	return query;
}

function isTraversal( t ) {
	return procedure[ t.type ] < 0;
}

function compileRules( rules, options, context ) {
	return rules.reduce( ( func, rule ) => {
		if( func === false ) {
			return func;
		}

		if( !( rule.type in Rules ) ) {
			core.error( `Rule type ${rule.type} is not supported by css-select` )
		}

		return Rules[ rule.type ]( func, rule, options, context );
	}, options.rootFunc || true );
}

function reduceRules( a, b ) {
	if( b === false || a === true ) {
		return a;
	}
	if( a === false || b === true ) {
		return b;
	}

	return ( elem ) => a( elem ) || b( elem );
}

function containsTraversal( t ) {
	return t.some( isTraversal );
}

//:not, :has and :matches have to compile selectors
//doing this in lib/pseudos.js would lead to circular dependencies,
//so we add them here
filters.not = function( next, token, options, context ) {
	const opts = {
		xmlMode: !!options.xmlMode,
		strict: !!options.strict,
		adapter: options.adapter,
	};

	if( opts.strict ) {
		if( token.length > 1 || token.some( containsTraversal ) ) {
			core.error( 'complex selectors in :not aren\'t allowed in strict mode' )
		}
	}

	const func = compileToken( token, opts, context );

	if( func === false ) {
		return next;
	}
	if( func === true ) {
		return false;
	}

	return ( elem ) => !func( elem ) && next( elem );
};

filters.has = function( next, token, options ) {
	const { adapter } = options;
	const opts        = {
		xmlMode: !!options.xmlMode,
		strict: !!options.strict,
		adapter,
	};

	//FIXME: Uses an array as a pointer to the current element (side effects)
	const context = token.some( containsTraversal ) ? [ PLACEHOLDER_ELEMENT ] : null;

	let func = compileToken( token, opts, context );

	if( func === false ) {
		return false;
	}
	if( func === true ) {
		return ( elem ) => adapter.getChildren( elem ).some( adapter.isTag ) && next( elem );
	}

	func = wrap( func, options );

	if( context ) {
		return ( elem ) => next( elem ) && ( ( context[ 0 ] = elem ), adapter.existsOne( func, adapter.getChildren( elem ) ) );
	}

	return ( elem ) => next( elem ) && adapter.existsOne( func, adapter.getChildren( elem ) );
};

filters.matches = function( next, token, options, context ) {
	const opts = {
		xmlMode: options.xmlMode,
		strict: options.strict,
		adapter: options.adapter,
		rootFunc: next,
	};
	return compileToken( token, opts, context );
};

/*compile.compileToken  = compileToken;
compile.compileUnsafe = compileUnsafe;*/

export default compile;