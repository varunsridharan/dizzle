export default function( currentValue, compareValue ) {
	return (compareValue && currentValue.slice( -compareValue.length ) === compareValue);
}