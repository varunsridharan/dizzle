import empty from "./empty";
import disabled from "./disabled";
import enabled from "./enabled";
import even from "./even";
import { createButtonPseudo, createInputPseudo, createPositionalPseudo } from "./helper";
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
import checked from "./checked";
import button from "./button";
import input from "./input";
import parent from "./parent";
import selected from "./selected";
import text from "./text";
import onlyChild from "./only-child";
import onlyOfType from "./only-of-type";
import has from "./has";
import { _isArray } from "@varunsridharan/js-vars";


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
	'checked': checked,
	'input': input,
	'button': button,
	'parent': parent,
	'selected': selected,
	'text': text,
	'only-child': onlyChild,
	'only-of-type': onlyOfType,
	'has': has
};

[ 'radio', 'checkbox', 'file', 'password', 'image' ].forEach( ( i ) => {
	pesudoHandlers[ i ] = createInputPseudo( i );
} );

[ 'submit', 'reset' ].forEach( ( i ) => {
	pesudoHandlers[ i ] = createButtonPseudo( i );
} );

export default function pesudoHandler( el, token ) {
	let { id } = token;
	if( _isArray( el ) ) {
		if( id in pesudoHandlers ) {
			el = ( isMarkedFunction( pesudoHandlers[ id ] ) ) ? pesudoHandlers[ id ]( el, token ) : el.filter( e => pesudoHandlers[ id ]( e, token ) );
		}
		return el;
	}
	return ( pesudoHandlers[ id ] ) ? pesudoHandlers[ id ]( el, token ) : true;
}
