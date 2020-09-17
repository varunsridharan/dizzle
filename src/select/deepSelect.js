import push from "../vars/_push";
import tokenize from "../tokenize/tokenize";
import processTokens from "../tokenize/processTokens";

export default function( selector, context, seed, fn ) {
	let results = [],
		i       = 0,
		groups, length, tokens, elems;

	groups = tokenize( selector );
	length = groups.length;

	for( ; i < length; i++ ) {
		tokens = processTokens( groups[ i ] );
		elems  = fn( tokens, context, seed );
		push.apply( results, elems );
	}
	return results;
}
