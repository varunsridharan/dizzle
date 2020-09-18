/**
 * following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
 * [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
 */
import { re_nthElement } from '../regex';

/**
 * returns a function that checks if an elements index matches the given rule
 * highly optimized to return the fastest solution
 */
export function compile( parsed ) {
	let a = parsed[ 0 ],
		b = parsed[ 1 ] - 1;

	/**
	 * when b <= 0, a*n won't be possible for any matches when a < 0
	 * besides, the specification says that no element is matched when a and b are 0
	 */
	if( b < 0 && a <= 0 ) {
		return false;
	}

	//when a is in the range -1..1, it matches any element (so only b is checked)
	if( a === -1 ) {
		return ( pos ) => pos <= b;
	}

	if( a === 0 ) {
		return ( pos ) => pos === b;
	}

	//when b <= 0 and a === 1, they match any element
	if( a === 1 ) {
		return b < 0 ? true : ( pos ) => pos >= b;
	}

	//when a > 0, modulo can be used to check if there is a match
	let bMod = b % a;
	if( bMod < 0 ) {
		bMod += a;
	}

	if( a > 1 ) {
		return ( pos ) => pos >= b && pos % a === bMod;
	}

	a *= -1; //make `a` positive
	return ( pos ) => pos <= b && pos % a === bMod;
}

/**
 * parses a nth-check formula, returns an array of two numbers
 */
export function parse( formula ) {
	formula = formula.trim().toLowerCase();

	if( formula === 'even' ) {
		return [ 2, 0 ];
	} else if( formula === 'odd' ) {
		return [ 2, 1 ];
	} else {
		let parsed = formula.match( re_nthElement );
		if( !parsed ) {
			throw new SyntaxError( `n-th rule couldn't be parsed ('${formula}')` );
		}

		let a;

		if( parsed[ 1 ] ) {
			a = parseInt( parsed[ 1 ], 10 );
			if( isNaN( a ) ) {
				if( parsed[ 1 ].charAt( 0 ) === '-' ) {
					a = -1;
				} else {
					a = 1;
				}
			}
		} else {
			a = 0;
		}

		return [ a, parsed[ 3 ] ? parseInt( ( parsed[ 2 ] || '' ) + parsed[ 3 ], 10 ) : 0 ];
	}
}

export default ( formula ) => compile( parse( formula ) );