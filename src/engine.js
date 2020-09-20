import doc from "./vars/doc";
import isString from "./typechecking/isString";
import query, { nativeQuery } from "./selector/query";
import { attrHandler, pseudoHandler } from "./selector/handler";

const defaultDom = doc;

function findAdvanced( selectors, context ) {
	let results = '';
	selectors.forEach( selector => {
		selector.forEach( single => {
			if( isString( single ) ) {
				results = query( single, results, context );
			} else {
				let { type } = single;
				if( 'attr' === type ) {
					results = attrHandler( single, results );
				} else if( 'pseudo' === type ) {
					results = pseudoHandler( single, results );
				}
			}

		} );
	} );
	return results;
}


export default function( selector, context = defaultDom ) {
	/**
	 * Node Types
	 * 1  -- Element Node
	 * 9  -- Document Node (document)
	 * 11 -- Document FRAGMENT
	 */
	let results = [], nodeType = context ? context.nodeType : 9;

	/**
	 * Checks if selector var is a !string or !empty and also check for given contxt node type (1,9,11)
	 */
	if( !isString( selector ) || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
		return results;
	}
	results = nativeQuery( selector, context );
	console.log(results);
	return ( false !== results ) ? results : findAdvanced( selector, context );
}