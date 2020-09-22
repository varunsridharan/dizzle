import adapter from "../../adapter";

export default function( el, token ) {
	let elemLang,
		{ data } = token;
	data         = data.toLowerCase();
	do {
		if( ( elemLang = el.lang || adapter.attr( el, 'lang' ) ) ) {
			elemLang = elemLang.toLowerCase();
			return elemLang === data || elemLang.indexOf( data + '-' ) === 0;
		}
	} while( ( el = el.parentNode ) && el.nodeType === 1 );
	return false;
}