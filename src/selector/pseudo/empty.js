export default function( elem ) {
	// http://www.w3.org/TR/selectors/#empty-pseudo
	// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
	//   but not by others (comment: 8; processing instruction: 7; etc.)
	// nodeType < 6 works because attributes (2) do not appear as children
	for( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
		if( elem.nodeType < 6 ) {
			return false;
		}
	}
	return true;
}