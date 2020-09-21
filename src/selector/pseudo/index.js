import empty from "./empty";
import disabled from "./disabled";
import enabled from "./enabled";
import _isArray from "../../vars/_isArray";
import even from "./even";
import { createPositionalPseudo } from "./helper";

export const pesudoHandlers = {
	'empty': empty,
	'disabled': disabled,
	'enabled': enabled,
	'even': createPositionalPseudo( even ),
};

export default function pesudoHandler( el, token ) {
	if( _isArray( el ) ) {
		let { id } = token;
		console.log(token);
		if( id in pesudoHandlers ) {
			console.log(pesudoHandlers[ id ]);
			el = pesudoHandlers[ id ]( el );
		}
		return el;
	} else {
		let status = true;
		let { id } = token;

		if( id in pesudoHandlers ) {
			status = pesudoHandlers[ id ]( el );
		}
		return status;
	}

}

