import { markFunction } from "../../helper";

export function createPositionalPseudo( fn ) {
	return markFunction( ( elements, argument ) => {
		argument         = +argument;
		let results      = fn( [], elements.length, argument );
		let currentIndex = results.shift();
		console.log(results);
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