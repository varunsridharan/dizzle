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
import nthOfType from "./nth-of-type";
import first from "./first";
import last from "./last";
import odd from "./odd";
import gt from "./gt";
import lt from "./lt";
import nthLastOfType from "./nth-last-of-type";
import nthLastChild from "./nth-last-child";


export const pesudoHandlers = {
	'empty': empty,
	'disabled': disabled,
	'enabled': enabled,
	'lang': lang,
	'visible': visible,
	'hidden': hidden,
	'contains': contains,
	'first-child': firstChild,
	'last-child': lastChild,
	'first-of-type': firstOfType,
	'last-of-type': lastOfType,
	'even': createPositionalPseudo( even ),
	'odd': createPositionalPseudo( odd ),
	'gt': createPositionalPseudo( gt ),
	'lt': createPositionalPseudo( lt ),
	'eq': createPositionalPseudo( eq ),
	'first': createPositionalPseudo( first ),
	'last': createPositionalPseudo( last ),
	'nth-of-type': nthOfType,
	'nth-last-of-type': nthLastOfType,
	'nth-last-child': nthLastChild,
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