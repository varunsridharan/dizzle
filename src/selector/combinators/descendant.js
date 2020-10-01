import { queryAll } from "../query";
import {filterElement} from "../../filter";
import { _filter } from "@varunsridharan/js-vars";

export default function( selector, context, results, nextToken ) {
	return results.concat( _filter.call( queryAll( selector, context ), ( el ) => filterElement( el, nextToken ) ) );
}
