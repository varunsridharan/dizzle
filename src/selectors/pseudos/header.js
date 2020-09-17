import { rheader } from "../../regex";

export default function( elem ) {
	return rheader.test( elem.nodeName );
}