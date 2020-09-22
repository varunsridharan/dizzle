import { markFunction } from "../../helper";

export function createPositionalPseudo( fn ) {
	return markFunction( ( elements, token ) => {
		token.data       = +token.data;
		let results      = fn( [], elements.length, token );
		let currentIndex = results.shift();
		// Match elements found at the specified indexes
		return elements.filter( ( el, index ) => {
			if( currentIndex === index ) {
				currentIndex = results.shift();
				return true;
			}
			return false;
		} );
	} );
}