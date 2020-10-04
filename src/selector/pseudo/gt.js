import { isUndefined } from "@varunsridharan/js-is";

export default function( elements, totalFound, token ) {
	let result = [];
	let i      = token.data < 0 ? token.data + totalFound : token.data;
	for( ; ++i < elements.length; ) {
		if( !isUndefined( elements[ i ] ) ) {
			result.push( elements[ i ] );
		}

	}
	return result;
}
