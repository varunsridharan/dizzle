import { markFunction } from "../../helper";
import { isUndefined } from "@varunsridharan/js-is";

export function createPositionalPseudo( fn ) {
	return markFunction( ( elements, token ) => {
		token.data = +token.data;
		return fn( elements, elements.length, token );
	} );
}

export function oddOrEven( isodd, elements, totalFound, result ) {
	var i = ( isodd ) ? 1 : 0;
	for( ; i < totalFound; i += 2 ) {
		if( !isUndefined( elements[ i ] ) ) {
			result.push( elements[ i ] );
		}
	}
	return result;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
export function createInputPseudo( type ) {
	return ( elem ) => elem.nodeName.toLowerCase() === 'input' && elem.type === type;
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
export function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === 'input' || name === 'button' ) && elem.type === type;
	};
}
