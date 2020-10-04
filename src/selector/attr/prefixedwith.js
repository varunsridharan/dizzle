import equals from "./equals";

export default function( currentValue, compareValue ) {
	return ( equals( currentValue, compareValue ) || currentValue.slice( 0, compareValue.length + 1 ) === `${compareValue}-` );
}
