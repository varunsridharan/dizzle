import _filter from "../vars/_filter";

export function attrHandler( data, context ) {
	return _filter.call( context, ( elem ) => {
		let value = elem.getAttribute( data.id );
		switch( data.action ) {
			case '!':
				return ( data.val !== value );
				break;
		}
	} );
}

export function pseudoHandler( data, results ) {
	if( 'first-child' === data.id ) {
		return results[ 0 ];
	} else if( 'last-child' === data.id ) {
		return results[ -1 + results.length ];
	}
}