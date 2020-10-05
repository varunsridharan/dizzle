import DizzleCore from "../../dizzlecore";

export default function( elem, { data } ) {
	return ( DizzleCore.find( data, elem ).length > 0 );
}
