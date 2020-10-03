function DizzleCore( selector, context ) {
	return DizzleCore.find( selector, context );
}

DizzleCore.instanceID = 'dizzle' + ( 1 * new Date() );

DizzleCore.err = msg => {
	throw new Error( msg );
};

export default DizzleCore;
