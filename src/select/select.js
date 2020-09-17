import push from "../vars/_push";
import slice from "../vars/_slice";
import core from "../core";
import validateElements from "../validate/validateElements";
import searchElements from "../find/searchElements";

export default function select( selector, context, results, seed ) {
	let result = ( ( seed ? seed.length : 0 ) > 0 ) ? validateElements( selector, context, seed ) : searchElements( selector, context, results, seed );
	push.apply( results, slice.call( result, 0 ) );

	if( results.length > 1 ) {
		core.uniqueSort( results );
	}
	return results;
}