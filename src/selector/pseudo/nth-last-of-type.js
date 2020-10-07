import nthCheck from "../../nth-check";

export default function( el, { data, adapter } ) {
	let func     = nthCheck( data ),
		siblings = adapter.getSiblings( el );

	let pos = 0;
	for( let i = siblings.length - 1; i >= 0; i-- ) {
		if( adapter.isTag( siblings[ i ] ) ) {
			if( siblings[ i ] === el ) {
				break;
			}
			if( adapter.getTagName( siblings[ i ] ) === adapter.getTagName( el ) ) {
				pos++;
			}
		}
	}

	return func( pos );

}
