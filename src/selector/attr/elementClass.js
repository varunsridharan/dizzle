import { rfindEscapeChar } from "../../regex";

export default function( currentValue, compareValue ) {
	compareValue  = compareValue.replace( rfindEscapeChar, '\\$&' );
	const pattern = `(?:^|\\s)${compareValue}(?:$|\\s)`;
	const regex   = new RegExp( pattern, '' );
	return currentValue != null && regex.test( currentValue );
}