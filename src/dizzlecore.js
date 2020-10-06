function DizzleCore( selector, context ) {
	return DizzleCore.find( selector, context );
}

export function err( msg ) {
	throw new Error( msg );
}

DizzleCore.uid = 'dizzle' + ( 1 * new Date() );
DizzleCore.err = err;
export default DizzleCore;
