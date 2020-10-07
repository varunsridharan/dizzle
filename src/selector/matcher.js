import { docElem } from "../helper";

let matcherFn = false;

export default function matches( el, selector ) {
	return el[ matcherFn ]( selector );
}

export function setupMatcherFn() {
	matcherFn = [ 'matches', 'webkitMatchesSelector', 'msMatchesSelector', 'mozMatchesSelector', 'oMatchesSelector' ].reduce( ( fn, name ) => ( fn ) ? fn : name in docElem ? name : fn, null );
}
