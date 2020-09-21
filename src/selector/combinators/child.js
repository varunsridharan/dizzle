import _filter from "../../vars/_filter";
import filter from "../../filter";
import { queryAll } from "../query";

export default function( selector, context, results, nextToken ) {
	return results.concat( _filter.call( queryAll( selector, context ), el => ( el.parentNode === context && filter( el, nextToken ) ) ) );
}