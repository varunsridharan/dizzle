import attrHandler from "./selector/attr";
import isUndefined from "./typechecking/isUndefined";
import pesudoHandler from "./selector/pseudo";

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