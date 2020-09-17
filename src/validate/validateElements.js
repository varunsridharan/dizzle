import { rbuggyMatches } from "../regex";
import elementsMatcher from "../find/elementsMatcher";
import deepSelect from "../select/deepSelect";
import validate from "./validate";

export default function( selector, context, seed ) {
	if( !rbuggyMatches.test( selector ) ) {
		try {
			return elementsMatcher( selector, seed );
		} catch( error ) {
		}
	}

	return deepSelect( selector, context, seed, validate );
}