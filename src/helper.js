import DizzleCore from "./dizzlecore";
import { win } from "@varunsridharan/js-vars";
import { isFunction, isString, isUndefined } from "@varunsridharan/js-is";
import adapter from "./adapter";

export const preferedDocument = win.document;
export var currentDocument    = preferedDocument,
		   docElem            = currentDocument.documentElement;

export function markFunction( fn ) {
	fn[ DizzleCore.guid ] = true;
	return fn;
}

export function isMarkedFunction( fn ) {
	return ( isFunction( fn ) && fn[ DizzleCore.guid ] );
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

/**
 * Checks & Returns Proper Adpater Function.
 * @param _adapter
 * @param _func
 * @return {*}
 */
export function adapterCall( _adapter ) {
	return { ...adapter, ..._adapter };
}
