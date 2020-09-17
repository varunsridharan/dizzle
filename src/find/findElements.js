import push from "../vars/_push";
import slice from "../vars/_slice";
import core from "../core";
import querySelector from "../select/querySelector";

export default function( contexts, token ) {
	var result,
		i       = 0,
		length  = contexts.length,
		results = [];

	for( ; i < length; i++ ) {
		result = querySelector( contexts[ i ], token.value );
		push.apply( results, slice.call( result, 0 ) );
	}

	if( length > 1 ) {
		core.uniqueSort( results );
	}

	return results;
}