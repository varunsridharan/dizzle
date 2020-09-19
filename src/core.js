function Dizzle( selector, context ) {
	return Dizzle.find( selector, context );
}

Dizzle.err = msg => {
	throw new Error( msg );
};

const core = Dizzle;

export default core;