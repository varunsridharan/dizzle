import core from "../../core";

export default function( elem, text ) {
	return ( elem.textContent || elem.innerText || core.getText( elem ) ).indexOf( text ) > -1;
}