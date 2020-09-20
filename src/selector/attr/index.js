import equals from "./equals";
import notequals from "./notequals";
import adapter from "../../adapter";
import prefixedwith from "./prefixedwith";
import contains from "./contains";
import containsword from "./containsword";
import endswith from "./endswith";
import startswith from "./startswith";

export const attrHandlers = {
	'=': equals,
	'!': notequals,
	'|': prefixedwith,
	'*': contains,
	'~': containsword,
	'$': endswith,
	'^': startswith,
};
export default function( el, token ) {
	let status              = true;
	let { action, id, val } = token;
	let currentValue        = adapter.attr.call( el, id );

	if( currentValue === null ) {
		return action === '!';
	}

	if( token.action in attrHandlers ) {
		status = attrHandlers[ action ]( currentValue, val );
	}
	return status;
}