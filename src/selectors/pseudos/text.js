export default function( elem ) {
	return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text';
}