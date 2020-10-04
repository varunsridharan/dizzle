export default function(elem) {
	var nodeName = elem.nodeName.toLowerCase();
	return ( nodeName === 'input' && !!elem.checked ) || ( nodeName === 'option' && !!elem.selected );
}
