export default function( currentValue, compareValue ) {
	return (compareValue && currentValue.indexOf( compareValue ) > -1  );
}