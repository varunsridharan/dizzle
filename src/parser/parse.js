/**
 * This is a modified version of
 * https://github.com/fb55/css-what/tree/eefc98a05fa29a402c6645e375df47d7f3958dfc
 * Stable Released V 3.4.1
 */
import { reAttr, reEscape, reName } from "../regex";
import DizzleCore from "../dizzlecore";
import { CombinatorTypes } from "../vars";
import { parseCache } from "../cache";

const attribSelectors        = {
		  '#': [ 'id', '=' ],
		  '.': [ 'class', 'element' ],
	  },
	  unpackPseudos          = new Set( [ 'has', 'not', 'matches', 'is', 'host', 'host-context' ] ),
	  stripQuotesFromPseudos = new Set( [ 'contains', 'icontains' ] ),
	  quotes                 = new Set( [ '"', '\'' ] );


/**
 * Below Regex Is Used To Escape CSS Selector such as
 * #myID.entry[1] -->  #myID\\.entry\\[1\\]
 * @type {RegExp}
 */
function funescape( escaped, escapedWhitespace ) {
	const high = parseInt( escaped, 16 ) - 0x10000;
	return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode( high + 0x10000 ) : String.fromCharCode( ( high >> 10 ) | 0xd800, ( high & 0x3ff ) | 0xdc00 );
}

function unescapeCSS( str ) {
	return str.replace( reEscape, funescape );
}

function isWhitespace( c ) {
	return c === ' ' || c === '\n' || c === '\t' || c === '\f' || c === '\r';
}

function parseSelector( subselects, selector ) {
	let tokens = [],
		sawWS  = false;

	function getName() {
		const match = selector.match( reName );
		if( !match ) {
			DizzleCore.err( `Expected name, found ${selector}` );
		}
		const [ sub ] = match;
		selector      = selector.substr( sub.length );
		return unescapeCSS( sub );
	}

	function stripWhitespace( start ) {
		while( isWhitespace( selector.charAt( start ) ) ) {
			start++;
		}
		selector = selector.substr( start );
	}

	function isEscaped( pos ) {
		let slashCount = 0;
		while( selector.charAt( --pos ) === '\\' ) {
			slashCount++;
		}
		return ( slashCount & 1 ) === 1;
	}

	stripWhitespace( 0 );

	while( selector !== '' ) {
		const firstChar = selector.charAt( 0 );

		if( isWhitespace( firstChar ) ) {
			sawWS = true;
			stripWhitespace( 1 );
		} else if( CombinatorTypes.indexOf( firstChar ) >= 0 ) {
			tokens.push( { type: 'combinators', action: firstChar } );
			sawWS = false;
			stripWhitespace( 1 );
		} else if( firstChar === ',' ) {
			if( tokens.length === 0 ) {
				DizzleCore.err( 'Empty sub-selector' );
			}
			subselects.push( tokens );
			tokens = [];
			sawWS  = false;
			stripWhitespace( 1 );
		} else {
			if( sawWS ) {
				if( tokens.length > 0 ) {
					tokens.push( { type: 'descendant', action: ' ' } );
				}
				sawWS = false;
			}
			if( firstChar === '*' ) {
				selector = selector.substr( 1 );
				tokens.push( { type: '*' } );
			} else if( firstChar in attribSelectors ) {
				const [ name, action ] = attribSelectors[ firstChar ];
				selector               = selector.substr( 1 );
				tokens.push( {
					type: 'attr',
					id: name, action,
					val: getName(),
					igCase: false,
				} );
			} else if( firstChar === '[' ) {
				selector             = selector.substr( 1 );
				const attributeMatch = selector.match( reAttr );
				if( !attributeMatch ) {
					DizzleCore.err( `Malformed attribute selector: ${selector}` );
				}
				const [ completeSelector, baseName, actionType, , quotedValue = "", value = quotedValue, igCase, ] = attributeMatch;
				selector                                                      = selector.substr( completeSelector.length );
				let name                                                      = unescapeCSS( baseName );
				name                                                          = name.toLowerCase();
				tokens.push( {
					type: 'attr',
					id: name,
					action: actionType || '=',
					val: unescapeCSS( value ),
					igCase: !!igCase,
				} );
			} else if( firstChar === ':' ) {
				if( selector.charAt( 1 ) === ':' ) {
					selector = selector.substr( 2 );
					tokens.push( { type: 'pseudo-element', id: getName().toLowerCase() } );
					continue;
				}
				selector   = selector.substr( 1 );
				const name = getName().toLowerCase();
				let data   = null;
				if( selector.startsWith( '(' ) ) {
					if( unpackPseudos.has( name ) ) {
						const quot   = selector.charAt( 1 );
						const quoted = quotes.has( quot );
						selector     = selector.substr( quoted ? 2 : 1 );
						data         = [];
						selector     = parseSelector( data, selector );
						if( quoted ) {
							if( !selector.startsWith( quot ) ) {
								DizzleCore.err( `Unmatched quotes in :${name}` );
							} else {
								selector = selector.substr( 1 );
							}
						}
						if( !selector.startsWith( ')' ) ) {
							DizzleCore.err( `Missing closing parenthesis in :${name} (${selector})` );
						}
						selector = selector.substr( 1 );
					} else {
						let pos     = 1,
							counter = 1;
						for( ; counter > 0 && pos < selector.length; pos++ ) {
							if( selector.charAt( pos ) === '(' && !isEscaped( pos ) ) {
								counter++;
							} else if( selector.charAt( pos ) === ')' && !isEscaped( pos ) ) {
								counter--;
							}
						}
						if( counter ) {
							DizzleCore.err( 'Parenthesis not matched' );
						}
						data     = selector.substr( 1, pos - 2 );
						selector = selector.substr( pos );
						if( stripQuotesFromPseudos.has( name ) ) {
							const quot = data.charAt( 0 );
							if( quot === data.slice( -1 ) && quotes.has( quot ) ) {
								data = data.slice( 1, -1 );
							}
							data = unescapeCSS( data );
						}
					}
				}
				tokens.push( { type: 'pseudo', id: name, data } );
			} else if( reName.test( selector ) ) {
				let name = getName();
				name     = name.toLowerCase();
				tokens.push( { type: 'tag', id: name } );
			} else {
				if( tokens.length && tokens[ tokens.length - 1 ].type === 'descendant' ) {
					tokens.pop();
				}
				addToken( subselects, tokens );
				return selector;
			}
		}
	}
	addToken( subselects, tokens );
	return selector;
}

function addToken( subselects, tokens ) {
	if( subselects.length > 0 && tokens.length === 0 ) {
		DizzleCore.err( 'Empty sub-selector' );
	}
	subselects.push( tokens );
}

export default function parse( selector ) {
	let cached = parseCache( selector );
	if( cached ) {
		return cached;
	}
	cached           = selector;
	const subselects = [];
	selector         = parseSelector( subselects, `${selector}` );
	if( selector !== '' ) {
		DizzleCore.err( `Unmatched selector: ${selector}` );
	}
	return parseCache( cached, subselects );
}
