import { getText } from "../../helper";

export default function( elem, token ) {
	return ( elem.textContent || getText( elem ) ).indexOf( token.data ) > -1;
}