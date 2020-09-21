export default function( result, totalFound ) {
	var i = 0;
	for( ; i < totalFound; i += 2 ) {
		result.push( i );
	}
	return result;
}