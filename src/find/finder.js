import findElements from "./findElements";
import elementsMatcher from "./elementsMatcher";
import filterAdapter from "./filterAdapter";

export default function( tokens, context ) {
	let type, elems, results = [],
		i                    = 0;
	elems                    = ( context instanceof Array ) ? context : [ context ];

	for( ; i < tokens.length; i++ ) {
		type    = tokens[ i ].type;
		results = ( type === 'child' ) ? findElements( elems, tokens[ i ] ) : ( type === 'sibling' ) ? elementsMatcher( tokens[ i ].value, elems ) : filterAdapter( elems, tokens[ i ] );
		elems   = results;
	}
	if( i !== tokens.length ) {
		results = [];
	}
	return results;
}