import doc from "./vars/doc";
import tokenize from "./selector/tokenize";
import isString from "./typechecking/isString";
import query from "./selector/query";
import { attrHandler, pseudoHandler } from "./selector/handler";

const defaultDom = doc;

function find( selectors, context ) {
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
	let parsed = tokenize( selector );
	return find( parsed, context );
}