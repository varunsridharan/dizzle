import push from "../vars/_push";
import slice from "../vars/_slice";
import querySelector from "../select/querySelector";
import deepSelect from "../select/deepSelect";
import finder from "./finder";

export default function( selector, context, results, seed ) {
	let result, i = 0,
		contexts  = context && context instanceof Array ? context : [ context ],
		length    = contexts.length;

	try {
		for( ; i < length; i++ ) {
			result = querySelector( contexts[ i ], selector );
			if( result.length > 0 ) {
				push.apply( results, slice.call( result, 0 ) );
			}
		}
		return results;
	} catch( error ) {
		return deepSelect( selector, context, seed, finder );
	}
}