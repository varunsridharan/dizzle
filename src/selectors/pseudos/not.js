import core from "../../core";
import sortOrder from "../../utilities/sortOrder";

export default function( elems, selector ) {
	var i = 0, j = 0, compared = 0, index,
		matches                = core( selector, null, null, elems ),
		elemsLength            = elems.length,
		matchesLength          = matches.length,
		results                = elems.slice( 0 );

	while( i < elemsLength && j < matchesLength ) {
		compared = sortOrder( elems[ i ], matches[ j ] );
		if( compared === 0 ) {
			if( ( index = results.indexOf( elems[ i ] ) ) !== -1 ) {
				results.splice( index, 1 );
			}
			i = i < elemsLength ? i + 1 : i;
			j = j < matchesLength ? j + 1 : j;
		} else if( compared < 0 ) {
			i = i < elemsLength ? i + 1 : i;
		} else {
			j = j < matchesLength ? j + 1 : j;
		}
	}

	return results;
}