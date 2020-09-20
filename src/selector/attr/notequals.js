import equals from "./equals";

export default function( currentValue, compareValue ) {
	return ( !equals( currentValue, compareValue ) );
}