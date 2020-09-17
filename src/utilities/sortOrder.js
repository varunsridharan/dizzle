import core from "../core";

export default function( a, b ) {
	if( a === b ) {
		core.hasDuplicate = true;
		return 0;
	}

	return ( !a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition( b ) & 4 ) ? -1 : 1;
}