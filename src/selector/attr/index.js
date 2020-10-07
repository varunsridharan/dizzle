import equals from "./equals";
import notequals from "./notequals";
import adapter from "../../adapter";
import prefixedwith from "./prefixedwith";
import contains from "./contains";
import containsword from "./containsword";
import endswith from "./endswith";
import startswith from "./startswith";
import elementClass from "./elementClass";
import { isNull } from "@varunsridharan/js-is";

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
	let status       = true,
		{ action }   = token,
		currentValue = token.adapter.attr( el, token.id );

	if( isNull( currentValue ) ) {
		return action === '!';
	}

	if( action in attrHandlers ) {
		status = attrHandlers[ action ]( currentValue, token.val );
	}

	return status;
}
