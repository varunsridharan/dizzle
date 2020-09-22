import core from "./core";
import win from "./vars/win";
import isFunction from "./typechecking/isFunction";

export const preferedDocument = win.document;
export var currentDocument    = preferedDocument,
		   docElem            = currentDocument.documentElement;

export function markFunction( fn ) {
	fn[ core.instanceID ] = true;
	return fn;
}

export function isMarkedFunction( fn ) {
	return ( isFunction( fn ) && fn[ core.instanceID ] && fn[ core.instanceID ] === true );
}