import parse from "./parser/parse";
import matcher from "./selector/matcher";
import { filterElement } from "./filter";

export function isCheckCustom( selector, elem ) {
	let r = parse( selector ).reduce( ( results, tokens ) => {
		let i      = 0,
			status = true;
		while( i < tokens.length ) {
			status = ( filterElement( elem, tokens[ i++ ] ) ) ? elem : false;
		}
		return status;
	}, true );
	return !!( r );
}

export default function is( selector, elem ) {
	try {
		return matcher( elem, selector );
	} catch( e ) {
		return isCheckCustom( selector, elem );
	}
}
