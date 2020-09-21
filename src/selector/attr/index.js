import equals from "./equals";
import notequals from "./notequals";
import adapter from "../../adapter";
import prefixedwith from "./prefixedwith";
import contains from "./contains";
import containsword from "./containsword";
import endswith from "./endswith";
import startswith from "./startswith";
import elementClass from "./elementClass";

export const attrHandlers = {
	'=': equals,
	'!': notequals,
	'|': prefixedwith,
	'*': contains,
	'~': containsword,
	'$': endswith,
	'^': startswith,
	/**
	 * The below function is used only to check for element class
	 * when query is used like
	 * .myclass1.myclass2 / .myclass .anotherelement
	 */
	'element': elementClass
};
export default function( el, token ) {
	let status              = true;
	let { action, id, val } = token;
	let currentValue        = adapter.attr( el, id );
	if( currentValue === null ) {
		return action === '!';
	}
	if( token.action in attrHandlers ) {
		status = attrHandlers[ action ]( currentValue, val );
	}
	return status;
}