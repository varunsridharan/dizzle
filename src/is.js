import parse from "./parser/parse";
import matcher from "./selector/matcher";
import { filterElement } from "./filter";
import { adapterCall } from "./helper";

export function isCheckCustom( selector, elem, adapter ) {
	let r = parse( selector ).reduce( ( results, tokens ) => {
		let i      = 0,
			status = true;
		while( i < tokens.length ) {
			let token     = tokens[ i++ ];
			token.adapter = adapter;
			status        = ( filterElement( elem, token ) ) ? elem : false;
		}
		return status;
	}, true );
	return !!( r );
}

export default function is( selector, elem, adapter ) {
	try {
		return matcher( elem, selector );
	} catch( e ) {
		return isCheckCustom( selector, elem, adapterCall( adapter ) );
	}
}
