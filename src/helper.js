import core from "./core";
import isFunction from "./typechecking/isFunction";
import isString from "./typechecking/isString";
import {win} from "@varunsridharan/js-vars";

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

/**
 * Fetches Text Value From Nodes
 *
 * NodeTypes
 * 	1 --> ELEMENT_NODE ( p / div)
 * 	9 --> DOCUMENT_NODE (window.document)
 * 	11 --> DOCUMENT_FRAGMENT_NODE (such as iframe)
 * 	3 --> TEXT_NODE  ( The actual Text inside an Element or Attr. )
 *  4 --> CDATA_SECTION_NODE (A CDATASection, such as <!CDATA[[ … ]]>.)
 * @param elem
 * @return {string|any}
 */
export function getText( elem ) {
	var node,
		ret      = '',
		i        = 0,
		nodeType = elem.nodeType;

	if( !nodeType ) {
		while( ( node = elem[ i++ ] ) ) {
			ret += getText( node );
		}
	} else if( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		if( isString( elem.textContent ) ) {
			return elem.textContent;
		} else {
			for( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	return ret;
}