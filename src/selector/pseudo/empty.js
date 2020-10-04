export default function( elem ) {
	for( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
		if( elem.nodeType < 6 ) {
			return false;
		}
	}
	return true;
}
