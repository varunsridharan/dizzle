export default function( elem ) {
	if( elem.parentNode ) {
		elem.parentNode.selectedIndex;
	}
	return elem.selected === true;
}