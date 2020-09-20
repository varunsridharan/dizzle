import doc from "./vars/doc";
import isString from "./typechecking/isString";
import { nativeQuery, queryAll } from "./selector/query";
import combinators from "./selector/combinators/index";
import attrHandler from "./selector/attr/index";
import parse from "./parser/parse";
import _isArray from "./vars/_isArray";

const defaultDom = doc;

function findAdvanced( selectors, root ) {
	return parse( selectors ).reduce( ( results, tokens ) => {
		let i       = 0,
			len     = tokens.length,
			context = ( !_isArray( root ) ) ? [ root ] : root;
		while( i < len ) {
			let token               = tokens[ i++ ];
			let combinator_callback = combinators[ ' ' ];

			if( token.type === 'combinators' && token.action in combinators ) {
				combinator_callback = combinators[ token.action ];
				token               = tokens[ i++ ];
			}
			let { type, id } = token;

			switch( type ) {
				case 'tag':
					context = context.reduce( ( nodes, el ) => queryAll( id, el ), [] );
					break;
				case 'attr':
					context = context.filter( el => attrHandler( el, token ) );
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

export default function( selector, context = defaultDom ) {
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

	results = nativeQuery( selector, context );
	return ( false !== results ) ? results : findAdvanced( selector, context );
}