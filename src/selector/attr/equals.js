import isUndefined from "../../typechecking/isUndefined";
import isNull from "../../typechecking/isNull";

export default function( currentValue, compareValue ) {
	return ( '' !== currentValue && compareValue === currentValue || !isUndefined( currentValue ) && !isNull( currentValue ) && '' !== currentValue );
}