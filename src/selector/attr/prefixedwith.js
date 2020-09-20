export default function( currentValue, compareValue ) {
	return ( currentValue === compareValue || currentValue.slice( 0, compareValue.length + 1 ) === `${compareValue}-` );
}