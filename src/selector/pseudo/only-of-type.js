export default function onlyOfType( elem, { adapter } ) {
	const siblings = adapter.getSiblings( elem );

	for( let i = 0, j = siblings.length; i < j; i++ ) {
		if( adapter.isTag( siblings[ i ] ) ) {
			if( siblings[ i ] === elem ) {
				continue;
			}
			if( adapter.getTagName( siblings[ i ] ) === adapter.getTagName( elem ) ) {
				return false;
			}
		}
	}
	return true;
}
