import { rcolonEnd, rcolonPass } from "../regex";
import core from "../core";

export default function( selector ) {
	var charactor,
		soFar        = selector,
		groups       = [],
		tokens       = [ '' ],
		tokenslength = 0,
		parentheses  = 0,
		colon        = false,
		brackets     = false,
		quotation    = false,
		errorMessage = 'Syntax error, unrecognized expression: \n \'';

	if( selector === '()' || selector[ 0 ] === ',' ) {
		core.error( errorMessage, selector );
	}

	while( soFar ) {
		charactor    = soFar[ 0 ];
		tokenslength = tokens.length - 1;

		if( charactor === '(' && !brackets && !quotation ) {
			if( !parentheses ) {
				tokens.push( '' );
				tokenslength++;
			}
			parentheses++;
		}

		if( parentheses ) {
			tokens[ tokenslength ] += charactor;

			if( charactor === '\'' ) {
				quotation = !quotation;
			}

			if( charactor === ')' && !brackets && !quotation ) {
				parentheses--;
				if( !parentheses ) {
					tokens.push( '' );
				}
			}
		} else {
			if( tokens[ tokenslength ].slice( -1 ) !== '\\' ) {
				if( charactor === '[' ) {
					brackets = true;
				} else if( charactor === ']' ) {
					brackets = false;
				}

				if( charactor === ':' && !brackets ) {
					tokens.push( '' );
					tokenslength++;
					if( !colon ) {
						colon = true;
					}
				}
			}

			if( colon ) {
				if( charactor === ',' ) {
					groups.push( tokens.slice( 0 ) );
					tokens = [ '' ];
				} else if( !rcolonPass.test( charactor ) ) {
					tokens[ tokenslength ] += charactor;
				}

				if( rcolonEnd.test( charactor ) ) {
					colon = false;
					tokens.push( rcolonPass.test( charactor ) ? charactor : '' );
				}
			} else {
				if( charactor === ',' ) {
					groups.push( tokens.slice( 0 ) );
					tokens = [ '' ];

					if( !soFar.slice( 1, soFar.length ).trim().length ) {
						core.error( errorMessage, selector );
					}
				} else {
					tokens[ tokenslength ] += charactor;
				}
			}
		}

		soFar = soFar.slice( 1 );

		if( charactor === ',' ) {
			soFar = soFar.trim();
		}
	}

	if( parentheses || brackets ) {
		core.error( errorMessage, selector );
	}

	groups.push( tokens );
	return groups;
}