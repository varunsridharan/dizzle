import { rwhitespace } from "../../regex";

export default function( currentValue, compareValue ) {
	return ( ' ' + currentValue.replace( rwhitespace, ' ' ) + ' ' ).indexOf( compareValue ) > -1;
}