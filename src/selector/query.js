import { rquickExpr } from "../regex";
import _push from "../vars/_push";
import { nonNativeSelector } from "../cache";

/**
 * Tries To Run Native Query Selectors.
 * @param selector
 * @param context
 * @return {boolean|[]}
 */
export function nativeQuery( selector, context ) {
	let results       = [],
		isNativeQuery = ( true !== nonNativeSelector( selector ) ),
		isNativeQueryData,
		selector_id,
		selector_class,
		nodeType      = context ? context.nodeType : 9;

	/**
	 * Return False if query is already cached as none native
	 */
	if( !isNativeQuery ) {
		return false;
	}

	/**
	 * If the Selector is simple then just use native query system.
	 */
	if( nodeType !== 11 ) {
		if( ( isNativeQueryData = rquickExpr.exec( selector ) ) ) {
			if( ( selector_id = isNativeQueryData[ 1 ] ) && nodeType === 9 ) {
				results.push( context.getElementById( selector_id ) );
				return results;
			} else if( isNativeQueryData[ 2 ] ) {
				_push.apply( results, context.getElementsByTagName( selector ) );
				return results;
			} else if( ( selector_class = isNativeQueryData[ 3 ] ) ) {
				_push.apply( results, context.getElementsByClassName( selector_class ) );
				return results;
			}
		}
	}
	results = queryAll( selector, context );
	if( false === results ) {
		nonNativeSelector( selector, true );
		return false;
	}
	return results;
}

export function queryAll( selector, context ) {
	let results = [];
	/**
	 * Try To Use Native QuerySelector All To Find Elements For The Provided Query
	 */
	try {
		_push.apply( results, context.querySelectorAll( selector ) );
		return results;
	} catch( e ) {
	}
	return false;
}

export default function( selector, existingResults, context ) {
	if( '' !== existingResults ) {
		let results = [];
		existingResults.forEach( elm => {
			_push.apply( results, nativeQuery( selector, elm ) );
		} );
		return results;
	}
	return nativeQuery( selector, context );
}