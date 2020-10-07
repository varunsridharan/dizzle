export default function( el, { data, adapter } ) {
	let elemLang;
	data = data.toLowerCase();
	do {
		if( ( elemLang = el.lang || adapter.attr( el, 'lang' ) ) ) {
			elemLang = elemLang.toLowerCase();
			return elemLang === data || elemLang.indexOf( data + '-' ) === 0;
		}
	} while( ( el = el.parentNode ) && el.nodeType === 1 );
	return false;
}
