import matcher from "../matcher";

export default function( selector, context, results, nextToken ) {
	const el = context.nextElementSibling;
	if( el && matcher( el, selector ) ) {
		results.push( el );
	}
	return results;
}