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
import contains from "./contains";
import eq from "./eq";
import firstChild from "./first-child";
import lastChild from "./last-child";
import firstOfType from "./first-of-type";
import lastOfType from "./last-of-type";
import first from "./first";
import last from "./last";
import odd from "./odd";
import gt from "./gt";
import lt from "./lt";

export const pesudoHandlers = {
	'empty': empty,
	'disabled': disabled,
	'enabled': enabled,
	'even': createPositionalPseudo( even ),
	'odd': createPositionalPseudo( odd ),
	'gt': createPositionalPseudo( gt ),
	'lt': createPositionalPseudo( lt ),
	'first-of-type': firstOfType,
	'last-of-type': lastOfType,
	'lang': lang,
	'visible': visible,
	'hidden': hidden,
	'contains': contains,
	'eq': createPositionalPseudo( eq ),
	'first-child': firstChild,
	'last-child': lastChild,
	'first': createPositionalPseudo( first ),
	'last': createPositionalPseudo( last ),
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