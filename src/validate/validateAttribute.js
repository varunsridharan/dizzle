import { rattribute } from "../regex";

export default function( selector ) {
	var i       = 0,
		isNot,
		noQuotation,
		results = [],
		token,
		pieces  = selector.split( rattribute ),
		length  = pieces.length - 1;

	while( i < length ) {
		if( !pieces[ i + 2 ] ) {
			break;
		}

		token       = [];
		isNot       = ( pieces[ i + 2 ] === '!=' );
		noQuotation = ( pieces[ i + 3 ] === undefined );
		token.push( '[', pieces[ i + 1 ], isNot ? '=' : pieces[ i + 2 ] );
		token.push( noQuotation ? pieces[ i + 3 ] = '\'' : pieces[ i + 3 ],
			( pieces[ i + 4 ] || pieces[ i + 5 ] || '' ).replace( /,/g, '_COMMA_' ),
			pieces[ i + 3 ], ']' );

		if( isNot ) {
			token.unshift( ':not(' );
			token.push( ')' );
		}

		results.push( pieces[ i ] + token.join( '' ) );
		i += 6;
	}

	if( results.length ) {
		results.push( pieces[ length ] );
		selector = results.join( '' );
	}

	return selector;
}