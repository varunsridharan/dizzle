import attrHandler from "./selector/attr";
import pesudoHandler from "./selector/pseudo";
import { isUndefined } from "@varunsridharan/js-is";
import { isCheckCustom } from "./is";
import { adapterCall } from "./helper";

export function filterElement( element, token ) {
	if( !isUndefined( token ) ) {
		switch( token.type ) {
			case 'attr':
				return attrHandler( element, token );
			case 'pseudo':
				return pesudoHandler( element, token );
		}
	}
	return true;
}

export default function filter( selector, elems, adapter ) {
	return elems.filter( ( elem ) => ( isCheckCustom( selector, elem, adapterCall( adapter ) ) ) );
}
