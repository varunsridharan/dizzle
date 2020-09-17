import { ralter, rchild, rnative } from '../regex';

export default function( tokens ) {
	var i, piece, prev, alter,
		pieces       = tokens,
		length       = pieces.length,
		results      = [],
		getQueryType = function( value ) {
			return ( !results.length || rchild.test( value ) ) ? 'child' : 'sibling';
		};

	for( i = 0; i < length; i++ ) {
		piece = pieces[ i ];

		if( piece !== '' && piece !== undefined ) {
			prev = results[ results.length - 1 ];

			if( ralter.exec( piece ) ) {
				alter = '[type=' + piece.substring( 1, piece.length ) + ']';

				if( prev && prev.type !== 'origin' ) {
					prev.value += alter;
				} else {
					results.push( { type: getQueryType( piece[ 0 ] ), value: alter } );
				}
			} else if( !piece.indexOf( ':' ) ) {
				if( rnative.test( piece ) ) {
					if( prev && prev.type !== 'origin' ) {
						prev.value += piece;
					} else {
						results.push( { type: getQueryType( piece[ 0 ] ), value: piece } );
					}
				} else {
					results.push( { type: 'origin', value: piece, arg: '' } );
				}
			} else if( !piece.indexOf( '(' ) ) {
				if( prev ) {
					if( prev.type !== 'origin' ) {
						prev.value += piece;
					} else {
						piece = piece.substring( 1, piece.length - 1 ).trim();

						if( !piece.indexOf( '\'' ) || !piece.indexOf( '"' ) ) {
							piece = piece.substring( 1, piece.length - 1 ).trim();
						}

						prev.arg = piece;
					}
				}
			} else {
				if( piece.slice( -1 ) === ' ' ) {
					piece += '*';
				}

				if( piece.trim()[ 0 ] === '+' ) {
					piece = '*' + piece;
				}
				results.push( { type: getQueryType( piece[ 0 ] ), value: piece.trim() } );
			}
		}
	}

	if( results[ 0 ].type === 'origin' ) {
		results.unshift( { value: '*', type: 'child' } );
	}

	return results;
}