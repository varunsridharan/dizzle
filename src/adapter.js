import _slice from './vars/_slice';
import isString from "./typechecking/isString";

const EMPTY_OBJECT = {};
const _Arr         = Array;

const adapter             = Object.create( null );

function isTag( elem ) {
	return elem.nodeType === 1;
}

function getChildren( elem ) {
	return elem.childNodes ? _slice.call( elem.childNodes, 0 ) : [];
}

function getParent( elem ) {
	return elem.parentNode;
}

function removeSubsets( nodes ) {
	let idx = nodes.length, node, ancestor, replace;

	// Check if each node (or one of its ancestors) is already contained in the  array.
	while( --idx > -1 ) {
		node         = ancestor = nodes[ idx ];
		// Temporarily remove the node under consideration
		nodes[ idx ] = null;
		replace      = true;

		while( ancestor ) {
			if( nodes.indexOf( ancestor ) > -1 ) {
				replace = false;
				nodes.splice( idx, 1 );
				break;
			}
			ancestor = adapter.getParent( ancestor );
		}
		// If the node has been found to be unique, re-insert it.
		if( replace ) {
			nodes[ idx ] = node;
		}
	}

	return nodes;
}

adapter.isTag             = isTag;
adapter.existsOne         = ( test, elems ) => elems.some( ( elem ) => isTag( elem ) ? test( elem ) || adapter.existsOne( test, adapter.getChildren( elem ) ) : false );
adapter.getSiblings       = function( elem ) {
	let parent = adapter.getParent( elem );
	return parent ? adapter.getChildren( parent ) : [ elem ];
};
adapter.getChildren       = getChildren;
adapter.getParent         = getParent;
adapter.getAttributeValue = function( elem, name ) {
	if( elem.attributes && name in elem.attributes ) {
		var attr = elem.attributes[ name ];
		return isString( attr ) ? attr : attr.value;
	} else if( name === 'class' && elem.classList ) {
		return _Arr.from( elem.classList ).join( ' ' );
	}
};
adapter.hasAttrib         = ( elem, name ) => name in ( elem.attributes || EMPTY_OBJECT );
adapter.removeSubsets     = removeSubsets;
adapter.getName           = ( elem ) => ( elem.tagName || '' ).toLowerCase();
adapter.findOne           = function( test, arr ) {
	var elem = null;
	for( var i = 0, l = arr.length; i < l && !elem; i++ ) {
		if( test( arr[ i ] ) ) {
			elem = arr[ i ];
		} else {
			var childs = getChildren( arr[ i ] );
			if( childs && childs.length > 0 ) {
				elem = adapter.findOne( test, childs );
			}
		}
	}
	return elem;
};
adapter.findAll           = function( test, elems ) {
	var result = [];
	for( var i = 0, j = elems.length; i < j; i++ ) {
		if( !isTag( elems[ i ] ) ) {
			continue;
		}
		if( test( elems[ i ] ) ) {
			result.push( elems[ i ] );
		}
		var childs = adapter.getChildren( elems[ i ] );
		if( childs ) {
			result = result.concat( adapter.findAll( test, childs ) );
		}
	}
	return result;
};
adapter.getText           = function( elem ) {
	if( _Arr.isArray( elem ) ) {
		return elem.map( adapter.getText ).join( '' );
	}

	if( isTag( elem ) ) {
		return adapter.getText( adapter.getChildren( elem ) );
	}

	if( elem.nodeType === 3 ) {
		return elem.nodeValue;
	}

	return '';
};
export default adapter;