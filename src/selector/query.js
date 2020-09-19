export default function( selector, existingResults, contxt ) {
	if( '' !== existingResults ) {
		let results = [];
		existingResults.forEach( elm => elm.querySelectorAll( selector )
										   .forEach( ( queryElem ) => results.push( queryElem ) ) );
		return results;
	}
	return contxt.querySelectorAll( selector );
}