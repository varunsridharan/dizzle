import core from "./core";
import sortOrder from "./utilities/sortOrder";
import isBoolean from "./typechecking/isBoolean";
import { rattributeQuotes, rbuggyMatches } from "./regex";
import isString from "./typechecking/isString";
import matches from "./vars/matches";

core.error = function( message, selector ) {
	throw new Error( message + '\n \'' + selector + '\'' );
};

core.uniqueSort = function( results ) {
	var elem, duplicates = [], i = 1, j = 0;

	core.hasDuplicate = false;
	results.sort( sortOrder );

	if( core.hasDuplicate ) {
		for( ; ( elem = results[ i ] ); i++ ) {
			if( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}

		while( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

core.attr = function( elem, name ) {
	var val,
		xml = core.isXML( elem );

	if( xml ) {
		return elem.getAttribute( name );
	}

	name = name.toLowerCase();
	val  = elem.getAttributeNode( name );
	return val ? isBoolean( elem[ name ] ) ? elem[ name ] ? name : null : val.specified ? val.value : null : null;
};

core.matches = function( expr, elements ) {
	return core( expr, null, null, elements );
};

core.matchesSelector = function( elem, expr ) {
	expr = expr.replace( rattributeQuotes, '=\'$1\']' );
	if( !rbuggyMatches.test( expr ) ) {
		try {
			return matches.call( elem, expr );
		} catch( e ) {
		}
	}
	return core( expr, null, null, [ elem ] ).length > 0;
};

core.getText = function( elem ) {
	var node, ret = '', i = 0, nodeType = elem.nodeType;

	if( nodeType ) {
		if( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			if( isString( elem.textContent ) ) {
				return elem.textContent;
			} else {
				for( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += core.getText( elem );
				}
			}
		} else if( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {
		for( ; ( node = elem[ i ] ); i++ ) {
			ret += core.getText( node );
		}
	}
	return ret;
};

core.isXML = function( elem ) {
	var documentElement = elem && ( elem.ownerDocument || elem ).documentElement;
	return documentElement ? documentElement.nodeName !== 'HTML' : false;
};

core.contains = function( a, b ) {
	var adown = a.nodeType === 9 ? a.documentElement : a,
		bup   = b && b.parentNode;
	return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains( bup ) );
};