import parse from "./parser/parse";
import matcher from "./selector/matcher";
import { filterElement } from "./filter";

export function isCheckCustom( selector, elem ) {
	let r = parse( selector ).reduce( ( results, tokens ) => {
		let i      = 0,
			len    = tokens.length,
			status = true;
		while( i < len ) {
			let token = tokens[ i++ ];

			if( status && ( 'attr' === token.type || 'pseudo' === token.type ) ) {
				status = ( filterElement( elem, token ) ) ? elem : false;
			}
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
