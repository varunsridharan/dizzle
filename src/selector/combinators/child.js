import filter from "../../filter";
import { queryAll } from "../query";
import { _filter } from "@varunsridharan/js-vars";

export default function( selector, context, results, nextToken ) {
	return results.concat( _filter.call( queryAll( selector, context ), el => ( el.parentNode === context && filter( el, nextToken ) ) ) );
}