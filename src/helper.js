import core from "./core";
import isUndefined from "./typechecking/isUndefined";

export function createCache() {
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