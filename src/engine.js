import isString from "./typechecking/isString";
import combinators from "./selector/combinators/index";
import attrHandler from "./selector/attr/index";
import parse from "./parser/parse";
import _isArray from "./vars/_isArray";
import isUndefined from "./typechecking/isUndefined";
import { nativeQuery } from "./selector/query";
import pesudoHandler, { pesudoHandlers } from "./selector/pseudo";
import { currentDocument, isMarkedFunction } from "./helper";

function nextToken( currentPos, tokens ) {
	if( !isUndefined( tokens[ currentPos ] ) ) {
		if( tokens[ currentPos ].type === 'pseudo' ) {
			if( !isMarkedFunction( pesudoHandlers[ tokens[ currentPos ].id ] ) ) {
				return { token: tokens[ currentPos++ ], pos: currentPos };
			}
		} else if( tokens[ currentPos ].type !== 'combinators' && tokens[ currentPos ].type !== 'descendant' ) {
			return { token: tokens[ currentPos++ ], pos: currentPos };
		}
	}

	return { token: false, pos: currentPos };
}

function validateToken( tokens ) {
	return ( 'tag' === tokens[ 0 ].type || 'attr' === tokens[ 0 ].type && ( 'id' === tokens[ 0 ].id || 'class' === tokens[ 0 ].id ) ) ? tokens : [ { type: 'descendant' }, ...tokens ];
}

export function findAdvanced( selectors, root ) {
	selectors = ( isString( selectors ) ) ? parse( selectors ) : selectors;
	root      = ( !_isArray( root ) ) ? [ root ] : root;
	return selectors.reduce( ( results, tokens ) => {
		tokens      = validateToken( tokens );
		let i       = 0,
			len     = tokens.length,
			context = root;
		while( i < len ) {
			let token               = tokens[ i++ ], newToken,
				combinator_callback = combinators[ ' ' ],
				/**
				 * having selectors like `body :hidden` is not working since pseudo works only for elements array
				 * so had to modify the code know if we found any sort of combinators.
				 */
				combinators_found   = false;

			if( ( token.type === 'combinators' || token.type === 'descendant' ) && token.action in combinators ) {
				combinator_callback = combinators[ token.action ];
				combinators_found   = true;
				token               = tokens[ i++ ];
			}

			let { type, id } = token;

			switch( type ) {
				case '*':
					newToken = nextToken( i, tokens );
					i        = newToken.pos;
					context  = context.reduce( ( nodes, el ) => combinator_callback( '*', el, nodes, newToken.token ), [] );
					break;
				case 'tag':
					newToken = nextToken( i, tokens );
					i        = newToken.pos;
					context  = context.reduce( ( nodes, el ) => combinator_callback( id, el, nodes, newToken.token ), [] );
					break;
				case 'attr':
					if( 'id' === id || 'class' === id ) {
						newToken      = nextToken( i, tokens );
						i             = newToken.pos;
						let _selector = ( 'id' === id ) ? '#' : '.';
						context       = context.reduce( ( nodes, el ) => combinator_callback( `${_selector}${token.val}`, el, nodes, newToken.token ), [] );
					} else {
						context = context.filter( el => attrHandler( el, token ) );
					}
					break;
				case 'pseudo':
					if( context === root || combinators_found ) {
						context = context.reduce( ( nodes, el ) => combinator_callback( `*`, el, nodes, false ), [] );
					}
					context = pesudoHandler( context, token );
					break;
			}
		}
		context.forEach( ( el ) => {
			if( !results.includes( el ) ) {
				results.push( el );
			}
		} );
		return results;
	}, [] );
}

export default function( selector, context ) {
	/**
	 * Node Types
	 * 1  -- Element Node
	 * 9  -- Document Node (document)
	 * 11 -- Document FRAGMENT
	 */
	let results  = false,
		nodeType = context ? context.nodeType : 9;
	/**
	 * Checks if selector var is a !string or !empty and also check for given contxt node type (1,9,11)
	 */
	if( !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
		return results;
	}

	context = context || currentDocument;

	if( isString( selector ) ) {
		results = nativeQuery( selector, context );
	}

	return ( false !== results ) ? results : findAdvanced( selector, context );
}