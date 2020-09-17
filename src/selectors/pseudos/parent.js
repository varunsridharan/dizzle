export default function( elem ) {
	var nodeType;
	elem = elem.firstChild;
	while( elem ) {
		if( elem.nodeName > '@' || ( nodeType = elem.nodeType ) === 3 || nodeType === 4 ) {
			return true;
		}
		elem = elem.nextSibling;
	}
	return false;
}