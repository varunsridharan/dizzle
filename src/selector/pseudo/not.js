import isUndefined from "../../typechecking/isUndefined";
import _isArray from "../../vars/_isArray";

export default function( elem, main_token ) {
	if( !isUndefined( main_token.data ) && _isArray( main_token.data ) ) {
		main_token.data.forEach( function( tokens ) {
			tokens.forEach( ( token ) => {
				console.log( token );
			} );
		} );

	}
	return true;
}