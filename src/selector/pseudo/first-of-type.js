import adapter from "../../adapter";

export default function( elem ) {
	const siblings = adapter.getSiblings( elem );

	for( let i = 0; i < siblings.length; i++ ) {
		if( adapter.isTag( siblings[ i ] ) ) {
			if( siblings[ i ] === elem ) {
				return true;
			}
			if( adapter.getTagName( siblings[ i ] ) === adapter.getTagName( elem ) ) {
				break;
			}

		}
	}
	return false;
}