import core from "../core";
import _slice from "../vars/_slice";

export default function( data, results ) {
	if( 'first-child' === data.name ) {
		return results[ 0 ];
	} else if( 'last-child' === data.name ) {
		return results[ -1 + results.length ];
	}
}