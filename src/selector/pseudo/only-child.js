export default function onlyChild( elem, { adapter } ) {
	const siblings = adapter.getSiblings( elem );

	for( let i = 0; i < siblings.length; i++ ) {
		if( adapter.isTag( siblings[ i ] ) && siblings[ i ] !== elem ) {
			return false;
		}
	}

	return true;
}
