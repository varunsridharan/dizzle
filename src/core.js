import { rquickExpr } from "./regex";
import push from "./vars/_push";
import slice from "./vars/_slice";
import doc from "./vars/doc";
import isString from "./typechecking/isString";
import select from "./select/select";

function Dizzle( selector, context, results, seed ) {
	let nodeType, matche, elems, elem;

	context  = context || doc;
	results  = results || [];
	nodeType = context.nodeType;

	if( seed && !seed.length ) {
		return [];
	}

	if( !selector || !isString( selector ) || ( nodeType !== 1 && nodeType !== 9 ) ) {
		return results;
	}

	if( !seed && ( matche = rquickExpr.exec( selector ) ) ) {
		if( matche [ 1 ] ) {
			if( nodeType === 9 ) {
				elems = context.getElementById( matche [ 1 ] );
				if( elems ) {
					results.push( elems );
				}
			} else {
				if( context.ownerDocument && ( elem = context.ownerDocument.getElementById( matche [ 1 ] ) ) && Dizzle.contains( context, elem ) && elem.id === matche [ 1 ] ) {
					results.push( elem );
				}
			}
		} else if( matche [ 2 ] ) {
			push.apply( results, slice.call( context.getElementsByTagName( matche [ 2 ] ), 0 ) );
		} else if( matche [ 3 ] ) {
			push.apply( results, slice.call( context.getElementsByClassName( matche[ 3 ] ), 0 ) );
		}
		if( !( matche [ 1 ] && results.length === 0 ) ) {
			return results;
		}
	}

	return select( selector.trim(), context, results, seed );
}

export default Dizzle;