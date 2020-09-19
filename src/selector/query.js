export default function( selector, existingResults, contxt ) {
	if( '' !== existingResults ) {
		let results = [];
		existingResults.forEach( ( elm ) => {
			let newResults = elm.querySelectorAll( selector );
			newResults.forEach( ( queryElem ) => results.push( queryElem ) );
		} );
		return results;
	}
	return contxt.querySelectorAll( selector );
}