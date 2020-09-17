import { rinputs } from "../../regex";

export default function( elem ) {
	return rinputs.test( elem.nodeName );
}