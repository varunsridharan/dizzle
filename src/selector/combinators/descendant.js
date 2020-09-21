import _filter from "../../vars/_filter";
import { queryAll } from "../query";
import filter from "../../filter";

export default function( selector, context, results, nextToken ) {
	return results.concat( _filter.call( queryAll( selector, context ), ( el ) => filter( el, nextToken ) ) );
	//return results.concat( queryAll( selector, context ) );
}