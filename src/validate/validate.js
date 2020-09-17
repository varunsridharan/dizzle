import elementsMatcher from "../find/elementsMatcher";
import filterAdapter from "../find/filterAdapter";

export default function( tokens, context, seed ) {
	var elems, results = seed, i = 0;

	for( ; i < tokens.length; i++ ) {
		elems   = results;
		results = ( tokens[ i ].type !== 'origin' ) ? elementsMatcher( tokens[ i ].value, elems ) : filterAdapter( elems, tokens[ i ] );
	}

	return results;
}