function DizzleCore( selector, context, adapter ) {
	return DizzleCore.find( selector, context, adapter );
}

export function err( msg ) {
	throw new Error( msg );
}

DizzleCore.uid = 'dizzle' + ( 1 * new Date() );
DizzleCore.err = err;
export default DizzleCore;
