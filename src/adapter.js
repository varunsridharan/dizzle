import { _slice } from "@varunsridharan/js-vars";

function isTag( elem ) {
	return elem.nodeType === 1;
}

function getChildren( elem ) {
	return elem.childNodes ? _slice.call( elem.childNodes, 0 ) : [];
}

function getParent( elem ) {
	return elem.parentNode;
}

export default {
	isTag: isTag,
	getChildren: getChildren,
	getParent: getParent,
	attr: function( el, key ) {
		return el.getAttribute( key );
	},
	getSiblings: function( elem ) {
		var parent = getParent( elem );
		return parent ? getChildren( parent ) : [ elem ];
	},
	getTagName: function( elem ) {
		return ( elem.tagName || '' ).toLowerCase();
	},
};
