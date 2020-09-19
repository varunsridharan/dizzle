import core from "../core";
import _slice from "../vars/_slice";

export default function( data, results ) {
	if( 'first-child' === data.id ) {
		return results[ 0 ];
	} else if( 'last-child' === data.id ) {
		return results[ -1 + results.length ];
	}
}