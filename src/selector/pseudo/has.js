import Dizzle from "../../dizzle";

export default function( elem, token ) {
	return ( Dizzle.find( token.data, elem ).length > 0 );
}