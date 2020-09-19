import doc from "./vars/doc";
import core from "./core";
import tokenize from "./selector/tokenize";
import isString from "./typechecking/isString";
import attribute from "./selector/attribute";
import query from "./selector/query";
import pseudo from "./selector/pseudo";

const defaultDom = doc;

function find( selectors, dom ) {
	let results = '';
	selectors.forEach( selector => {
		selector.forEach( single => {
			if( isString( single ) ) {
				results = query( single, results, dom );
			} else {
				if( 'attribute' === single.type ) {
					results = attribute( single, results );
				} else if( 'pseudo' === single.type ) {
					results = pseudo( single, results );
				}
			}

		} );
	} );
	return results;
}


export default function( selector, context = defaultDom ) {
	let parsed = tokenize( selector );
	core.log( parsed );
	return find( parsed, context );
}