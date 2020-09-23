import matches from "../matcher";

export default function( selector, context, results ) {
	let el = context.nextElementSibling;
	while( el ) {
		if( matches( el, selector ) ) {
			results.push( el );
		}
		el = el.nextElementSibling;
	}
	return results;
}