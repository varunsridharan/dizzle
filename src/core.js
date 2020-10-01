function Dizzle( selector, context ) {
	return Dizzle.find( selector, context );
}

Dizzle.instanceID = 'dizzle' + ( 1 * new Date() );

Dizzle.err = msg => {
	throw new Error( msg );
};

const core = Dizzle;

export default core;