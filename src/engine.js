import doc from "./vars/doc";
import core from "./core";
import tokenize from "./selector/tokenize";
import isString from "./typechecking/isString";
import attribute from "./selector/attribute";
import query from "./selector/query";
import pseudo from "./selector/pseudo";

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
					results = attribute( single, results );
				} else if( 'pseudo' === type ) {
					results = pseudo( single, results );
				}
			}

		} );
	} );
	return results;
}


export default function( selector, context = defaultDom ) {
	let parsed = tokenize( selector );
	console.log( parsed );
	return find( parsed, context );
}