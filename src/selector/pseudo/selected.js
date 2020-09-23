export default function( elem ) {
	/**
	 * Accessing this property makes selected-by-default
	 * options in Safari work properly
	 */
	if( elem.parentNode ) {
		elem.parentNode.selectedIndex;
	}
	return elem.selected === true;
}