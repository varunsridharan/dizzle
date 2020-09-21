import core from "./core";

export function markFunction( fn ) {
	fn[ core.instanceID ] = true;
	return fn;
}

export function isMarkedFunction( fn ) {
	return ( fn[ core.instanceID ] && fn[ core.instanceID ] === true );
}