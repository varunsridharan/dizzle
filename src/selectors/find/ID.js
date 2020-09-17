export default function( id, context, xml ) {
	if( context.getElementById && !xml ) {
		var m = context.getElementById( id );
		// Check parentNode to catch when Blackberry 4.6 returns
		// nodes that are no longer in the document #6963
		return m && m.parentNode ? [ m ] : [];
	}
}