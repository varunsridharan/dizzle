import attrHandler from "./selector/attr";
import pesudoHandler from "./selector/pseudo";
import { isUndefined } from "@varunsridharan/js-is";

export default function( element, token ) {
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