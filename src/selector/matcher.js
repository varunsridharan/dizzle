import docEle from "../vars/docEle";

const matcherFn = [ 'matches', 'webkitMatchesSelector', 'msMatchesSelector' ].reduce( ( fn, name ) => ( fn ) ? fn : name in docEle ? name : fn, null );

export default function matches( el, selector ) {
	return el[ matcherFn ]( selector );
}
