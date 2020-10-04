import { rfindEscapeChar } from "../../regex";

export default function( currentValue, compareValue ) {
	compareValue = compareValue.replace( rfindEscapeChar, '\\$&' );
	return currentValue != null && ( new RegExp( `(?:^|\\s)${compareValue}(?:$|\\s)`, '' ) ).test( currentValue );
}
