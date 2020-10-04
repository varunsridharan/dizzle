import { isUndefined } from "@varunsridharan/js-is";

export default function( elements, totalFound, token ) {
	let result = [];
	let i      = token.data < 0 ? token.data + totalFound : token.data > totalFound ? totalFound : token.data;
	for( ; --i >= 0; ) {
		if( !isUndefined( elements[ i ] ) ) {
			result.push( elements[ i ] );
		}

	}
	return result;
}
