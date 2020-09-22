import empty from "./empty";
import disabled from "./disabled";
import enabled from "./enabled";
import _isArray from "../../vars/_isArray";
import even from "./even";
import { createPositionalPseudo } from "./helper";
import lang from "./lang";
import { isMarkedFunction } from "../../helper";
import visible from "./visible";
import hidden from "./hidden";

export const pesudoHandlers = {
	'empty': empty,
	'disabled': disabled,
	'enabled': enabled,
	'even': createPositionalPseudo( even ),
	'lang': lang,
	'visible': visible,
	'hidden': hidden
};

export default function pesudoHandler( el, token ) {
	if( _isArray( el ) ) {
		let { id } = token;
		if( id in pesudoHandlers ) {
			if( isMarkedFunction( pesudoHandlers[ id ] ) ) {
				el = pesudoHandlers[ id ]( el, token );
			} else {
				el = el.filter( e => pesudoHandlers[ id ]( e, token ) );
			}
		}
		return el;
	} else {
		let status = true;
		let { id } = token;

		if( id in pesudoHandlers ) {
			status = pesudoHandlers[ id ]( el, token );
		}
		return status;
	}

}