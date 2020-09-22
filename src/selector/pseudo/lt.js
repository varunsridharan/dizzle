export default function( result, totalFound, token ) {
	let i = token.data < 0 ? token.data + totalFound : token.data > totalFound ? totalFound : token.data;
	for( ; --i >= 0; ) {
		result.push( i );
	}
	console.log( result);
	return result;
}