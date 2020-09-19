import core from "../core";
import _filter from "../vars/_filter";

export default function( data, contxt ) {
	return _filter.call( contxt, ( elem ) => {
		let value = elem.getAttribute( data.id );
		switch( data.action ) {
			case '!':
				return ( data.val !== value );
			break;
		}
	} );
}