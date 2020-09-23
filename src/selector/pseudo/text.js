export default function( elem ) {
	var attr;
	return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ( ( attr = elem.getAttribute( 'type' ) ) == null || attr.toLowerCase() === 'text' );
}