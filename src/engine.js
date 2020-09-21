import doc from "./vars/doc";
import isString from "./typechecking/isString";
import combinators from "./selector/combinators/index";
import attrHandler from "./selector/attr/index";
import parse from "./parser/parse";
import _isArray from "./vars/_isArray";
import isUndefined from "./typechecking/isUndefined";
import { nativeQuery } from "./selector/query";
import pesudoHandler, { pesudoHandlers } from "./selector/pseudo";
import { isMarkedFunction } from "./helper";

function nextToken( currentPos, tokens ) {
	if( !isUndefined( tokens[ currentPos ] ) ) {
		if( tokens[ currentPos ].type === 'pseudo' ) {
			if( !isMarkedFunction( pesudoHandlers[ tokens[ currentPos ].id ] ) ) {
				return { token: tokens[ currentPos++ ], pos: currentPos };
			}
		} else if( tokens[ currentPos ].type !== 'combinators' ) {
			return { token: tokens[ currentPos++ ], pos: currentPos };
		}
	}

	return { token: false, pos: currentPos };
}

export function findAdvanced( selectors, root ) {
	selectors = ( isString( selectors ) ) ? parse( selectors ) : selectors;
	return selectors.reduce( ( results, tokens ) => {
		let i       = 0,
			len     = tokens.length,
			context = ( !_isArray( root ) ) ? [ root ] : root;
		while( i < len ) {
			let token               = tokens[ i++ ], newToken,
				combinator_callback = combinators[ ' ' ];

			if( token.type === 'combinators' && token.action in combinators ) {
				combinator_callback = combinators[ token.action ];
				token               = tokens[ i++ ];
			}
			let { type, id } = token;

			switch( type ) {
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

export default function( selector, context = doc ) {
	/**
	 * Node Types
	 * 1  -- Element Node
	 * 9  -- Document Node (document)
	 * 11 -- Document FRAGMENT
	 */
	let results  = [],
		nodeType = context ? context.nodeType : 9;
	/**
	 * Checks if selector var is a !string or !empty and also check for given contxt node type (1,9,11)
	 */
	if( !isString( selector ) || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
		return results;
	}

	/**
	 * Well this is a quick fix
	 * this is just to make sure that this runs in iframe.
	 * just comment it out and try with our built in speed test to replicate the issue.
	 * @todo figureout who other libs such as Sizzle dose it.
	 */
	if( !context.querySelectorAll && context.documentElement.querySelectorAll ) {
		context = context.documentElement;
	}

	results = nativeQuery( selector, context );
	return ( false !== results ) ? results : findAdvanced( selector, context );
}