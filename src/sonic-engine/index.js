import parse from '../css-selector-parser/parse';

const doc             = window.document,
	  documentElement = doc.documentElement,
	  _filter         = [].filter,
	  matchesFn       = [ 'matches', 'webkitMatchesSelector', 'msMatchesSelector' ].reduce( ( fn, name ) => ( fn ) ? fn : name in documentElement ? name : fn, null ),
	  combinators     = {
		  ' ': ( context, token, results ) => results.concat( _filter.call( context.querySelectorAll( token.selector ), ( el ) => filter( el, token.filters ) ) ),
		  '>': ( context, token, results ) => results.concat( _filter.call( context.querySelectorAll( token.selector ), ( el ) => el.parentNode === context && filter( el, token.filters ) ) ),
		  '+': ( context, token, results ) => {
			  const el = context.nextElementSibling;
			  if( el && matches( el, token.selector ) && filter( el, token.filters ) ) {
				  results.push( el );
			  }
			  return results;
		  },
		  '~': ( context, token, results ) => {
			  let el = context.nextElementSibling;
			  while( el ) {
				  if( matches( el, token.selector ) && filter( el, token.filters ) ) {
					  results.push( el );
				  }
				  el = el.nextElementSibling;
			  }
			  return results;
		  }
	  };
export const pseudos  = Object.create( null );

function matches( el, selector ) {
	return el[ matchesFn ]( selector );
}

function filter( el, filters ) {
	return filters.every( ( { name, value } ) => pseudos[ name ]( el, value ) );
}

function tokenize( selector ) {
	return parse( selector ).map( ( tokens ) => {
		return tokens.map( ( token ) => {
			if( typeof token === 'string' ) {
				return token;
			}
			const selector = [];
			const filters  = [];
			if( token.nodeName ) {
				selector.push( token.nodeName );
			}
			token.attributes.forEach( ( { name, value, operator, ignoreCase } ) => {
				if( name === 'id' ) {
					selector.push( '#', value );
				} else if( name === 'class' ) {
					selector.push( '.', value );
				} else {
					selector.push( '[', name );
					if( operator !== '' ) {
						selector.push( operator, '"', value, '"' );
						if( ignoreCase ) {
							selector.push( ' i' );
						}
					}
					selector.push( ']' );
				}
			} );
			token.pseudos.forEach( ( { name, value } ) => {
				if( name in pseudos ) {
					filters.push( { name, value } );
				} else {
					selector.push( ':', name );
					if( value !== '' ) {
						selector.push( '(', value, ')' );
					}
				}
			} );
			return {
				filters,
				selector: selector.length === 0 ? '*' : selector.join( '' )
			};
		} );
	} );
}

export function is( el, selector ) {
	const token = tokenize( selector )[ 0 ][ 0 ];
	return matches( el, token.selector ) && filter( el, token.filters );
}

export function find( selector, root ) {
	return query( selector, root )[ 0 ] || null;
}

export default function query( selector, root = doc ) {
	if( typeof root === 'string' ) {
		root = find( root );
	}
	root = [ root ];
	return tokenize( selector ).reduce( ( results, tokens ) => {
		let context = root,
			i       = 0;
		const len   = tokens.length;
		while( i < len ) {
			let token      = tokens[ i++ ],
				combinator = combinators[ ' ' ];
			if( token in combinators ) {
				combinator = combinators[ token ];
				token      = tokens[ i++ ];
			}
			context = context.reduce( ( nodes, el ) => combinator( el, token, nodes ), [] );
		}
		context.forEach( ( el ) => {
			if( !results.includes( el ) ) {
				results.push( el );
			}
		} );
		return results;
	}, [] ).sort( ( a, b ) => 3 - ( a.compareDocumentPosition( b ) & 6 ) );
}