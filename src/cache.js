import isUndefined from "./typechecking/isUndefined";
import core from "./core";

function createCache() {
	let keys = [];

	function cache( key, value ) {
		if( isUndefined( value ) ) {
			return cache[ key + ' ' ];
		}
		if( keys.push( key + ' ' ) > core.cacheLength ) {
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + ' ' ] = value );
	}

	return cache;
}

/**
 * Stores All Parsed Selector In Cache.
 * @type {cache}
 */
export const parseCache = createCache();

/**
 * Stores All Non Native Selector Data.
 * @type {cache}
 */
export const nonNativeSelector = createCache();

/**
 * Stores All Selector's Results in Cache
 * @type {cache}
 */
export const selectorResultsCache = createCache();