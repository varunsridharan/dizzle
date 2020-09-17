import { rpseudoUpperkeys } from "../regex";
import validateAttribute from "../validate/validateAttribute";
import matches from "../vars/matches";

export default function( selector, seed ) {
	let type,
		newSelector,
		results = [],
		length  = seed.length,
		i       = 0;
	newSelector = validateAttribute( selector ).replace( rpseudoUpperkeys, ( x ) => x.toLowerCase() );
	newSelector = newSelector.replace( /_COMMA_/g, ',' );

	for( ; i < length; i++ ) {
		type = seed[ i ].nodeType;
		if( type && type === 1 && matches.call( seed[ i ], newSelector ) ) {
			results.push( seed [ i ] );
		}
	}

	return results;
}