import core from '../core';

export default function( elements, token ) {
	let i, element, fn, value, argument, length, results = [];

	if( !elements || !( length = elements.length ) || !token ) {
		return [];
	}

	value    = token.value.substring( 1, token.value.length ).toLowerCase();
	argument = token.arg;
	fn       = core.selectors.pseudos[ value ];

	switch( value ) {
		case 'not':
			results = fn( elements, argument );
			break;

		case 'first':
			results.push( elements[ 0 ] );
			break;

		case 'last':
			results.push( elements[ length - 1 ] );
			break;

		case 'nth': // Deprecated
		case 'eq':
			argument = +argument;
			if( length > argument ) {
				results.push( elements[ argument < 0 ? argument + length : argument ] );
			}
			break;

		case 'even':
			for( i = 0; i < length; i += 2 ) {
				results.push( elements[ i ] );
			}
			break;

		case 'odd':
			for( i = 1; i < length; i += 2 ) {
				results.push( elements[ i ] );
			}
			break;

		case 'lt':
			argument = +argument;
			for( i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				results.push( elements[ i ] );
			}
			break;

		case 'gt':
			argument = +argument;
			for( i = argument < 0 ? argument + length : argument; ++i < length; ) {
				results.push( elements[ i ] );
			}
			break;

		default:
			if( !fn ) {
				core.error( 'Syntax error or unsupported pseudo: ', value );
				return [];
			}

			for( i = 0; i < length; i++ ) {
				element = elements[ i ];
				if( fn( element, argument ) ) {
					results.push( element );
				}
			}
	}

	return results;
}