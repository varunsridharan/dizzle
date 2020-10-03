import DizzleCore from "../../dizzlecore";

export default function( elem, token ) {
	return ( DizzleCore.find( token.data, elem ).length > 0 );
}
