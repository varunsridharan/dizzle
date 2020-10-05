import { isUndefined } from "@varunsridharan/js-is";

export default function( elements, totalFound, { data } ) {
	let result = [];
	let i      = data < 0 ? data + totalFound : data > totalFound ? totalFound : data;
	for( ; --i >= 0; ) {
		if( !isUndefined( elements[ i ] ) ) {
			result.push( elements[ i ] );
		}

	}
	return result;
}
