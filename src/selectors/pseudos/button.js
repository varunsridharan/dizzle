export default function( elem ) {
	var name = elem.nodeName.toLowerCase();
	return name === 'input' && elem.type === 'button' || name === 'button';
}