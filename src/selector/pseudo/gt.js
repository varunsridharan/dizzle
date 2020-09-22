export default function( result, totalFound, token ) {
	let i = token.data < 0 ? token.data + totalFound : token.data;
	for( ; ++i < totalFound; ) {
		result.push( i );
	}
	return result;
}