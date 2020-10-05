import { isUndefined } from "@varunsridharan/js-is";

export default function( elements, totalFound, { data } ) {
	let result = [];
	let i      = data < 0 ? data + totalFound : data;
	for( ; ++i < elements.length; ) {
		if( !isUndefined( elements[ i ] ) ) {
			result.push( elements[ i ] );
		}

	}
	return result;
}
