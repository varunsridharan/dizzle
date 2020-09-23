import core from "../../core";

export default function( elem, token ) {
	return ( core.find( token.data, elem ).length > 0 );
}