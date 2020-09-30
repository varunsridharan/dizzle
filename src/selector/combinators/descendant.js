import { queryAll } from "../query";
import filter from "../../filter";
import { _filter } from "@varunsridharan/js-vars";

export default function( selector, context, results, nextToken ) {
	return results.concat( _filter.call( queryAll( selector, context ), ( el ) => filter( el, nextToken ) ) );
}