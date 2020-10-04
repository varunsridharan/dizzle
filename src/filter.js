import attrHandler from "./selector/attr";
import pesudoHandler from "./selector/pseudo";
import { isUndefined } from "@varunsridharan/js-is";
import { isCheckCustom } from "./is";

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

export default function filter( selector, elems ) {
	return elems.filter( ( elem ) => ( isCheckCustom( selector, elem ) ) );
}
