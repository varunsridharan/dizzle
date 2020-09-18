import core from "../core";

const reName                 = /^[^\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/,
	  reEscape               = /\\([\da-f]{1,6}\s?|(\s)|.)/gi,
	  // Modified version of https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L87
	  reAttr                 = /^\s*((?:\\.|[\w\u00b0-\uFFFF-])+)\s*(?:(\S?)=\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00b0-\uFFFF-])*)|)|)\s*(i)?\]/,
	  actionTypes            = {
		  undefined: 'exists',
		  '': 'equals',
		  '~': 'element',
		  '^': 'start',
		  $: 'end',
		  '*': 'any',
		  '!': 'not',
		  '|': 'hyphen',
	  },
	  Traversals             = {
		  '>': 'child',
		  '<': 'parent',
		  '~': 'sibling',
		  '+': 'adjacent',
	  },
	  attribSelectors        = {
		  '#': [ 'id', 'equals' ],
		  '.': [ 'class', 'element' ],
	  },
	  // Pseudos, whose data property is parsed as well.
	  unpackPseudos          = new Set( [ 'has', 'not', 'matches', 'is' ] ),
	  stripQuotesFromPseudos = new Set( [ 'contains', 'icontains' ] ),
	  quotes                 = new Set( [ '"', '\'' ] );


// Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152
function funescape( escaped, escapedWhitespace ) {
	const high = parseInt( escaped, 16 ) - 0x10000;
	// NaN means non-codepoint
	/**
	 * String.fromCharCode( high + 0x10000 ) --> BMP codepoint
	 * String.fromCharCode( ( high >> 10 ) | 0xd800, ( high & 0x3ff ) | 0xdc00 ) -->  Supplemental Plane codepoint (surrogate pair)
	 */
	return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode( high + 0x10000 ) : String.fromCharCode( ( high >> 10 ) | 0xd800, ( high & 0x3ff ) | 0xdc00 );
}

function unescapeCSS( str ) {
	return str.replace( reEscape, funescape );
}

function isWhitespace( c ) {
	return c === ' ' || c === '\n' || c === '\t' || c === '\f' || c === '\r';
}

function addToken( subselects, tokens ) {
	if( subselects.length > 0 && tokens.length === 0 ) {
		core.error( 'Empty sub-selector' );
	}
	subselects.push( tokens );
}

function parseSelector( subselects, selector ) {
	let tokens = [],
		sawWS  = false;

	function getName() {
		const match = selector.match( reName );

		if( !match ) {
			core.error( `Expected name, found ${selector}` );
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
		} else if( firstChar in Traversals ) {
			tokens.push( { type: Traversals[ firstChar ] } );
			sawWS = false;
			stripWhitespace( 1 );
		} else if( firstChar === ',' ) {
			if( tokens.length === 0 ) {
				core.error( 'Empty sub-selector' );
			}
			subselects.push( tokens );
			tokens = [];
			sawWS  = false;
			stripWhitespace( 1 );
		} else {
			if( sawWS ) {
				if( tokens.length > 0 ) {
					tokens.push( { type: 'descendant' } );
				}
				sawWS = false;
			}
			if( firstChar === '*' ) {
				selector = selector.substr( 1 );
				tokens.push( { type: 'universal' } );
			} else if( firstChar in attribSelectors ) {
				const [ name, action ] = attribSelectors[ firstChar ];
				selector               = selector.substr( 1 );
				tokens.push( {
					type: 'attribute',
					name,
					action,
					value: getName(),
					ignoreCase: false,
				} );
			} else if( firstChar === '[' ) {
				selector             = selector.substr( 1 );
				const attributeMatch = selector.match( reAttr );
				if( !attributeMatch ) {
					core.error( `Malformed attribute selector: ${selector}` );
				}

				const [ completeSelector, baseName, actionType, , quotedValue = "", value = quotedValue, ignoreCase ] = attributeMatch;

				selector = selector.substr( completeSelector.length );
				let name = unescapeCSS( baseName );
				name     = name.toLowerCase();
				tokens.push( {
					type: 'attribute',
					name,
					action: actionTypes[ actionType ],
					value: unescapeCSS( value ),
					ignoreCase: !!ignoreCase,
				} );
			} else if( firstChar === ':' ) {
				if( selector.charAt( 1 ) === ':' ) {
					selector = selector.substr( 2 );
					tokens.push( {
						type: 'pseudo-element',
						name: getName().toLowerCase(),
					} );
					continue;
				}

				selector = selector.substr( 1 );

				const name = getName().toLowerCase();
				let data   = null;

				if( selector.startsWith( '(' ) ) {
					if( unpackPseudos.has( name ) ) {
						const quot   = selector.charAt( 1 ),
							  quoted = quotes.has( quot );

						selector = selector.substr( quoted ? 2 : 1 );
						data     = [];
						selector = parseSelector( data, selector );

						if( quoted ) {
							if( !selector.startsWith( quot ) ) {
								core.error( `Unmatched quotes in :${name}` );
							} else {
								selector = selector.substr( 1 );
							}
						}

						if( !selector.startsWith( ')' ) ) {
							core.error( `Missing closing parenthesis in :${name} (${selector})` );
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
							core.error( 'Parenthesis not matched' );
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

				tokens.push( { type: 'pseudo', name, data } );
			} else if( reName.test( selector ) ) {
				let name = getName();
				name     = name.toLowerCase();

				tokens.push( { type: 'tag', name } );
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

export default function parse( selector ) {
	const subselects = [];

	selector = parseSelector( subselects, `${selector}` );

	if( selector !== '' ) {
		core.error( `Unmatched selector: ${selector}` );
	}

	return subselects;
}