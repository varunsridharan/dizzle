function Dizzle() {
}

Dizzle.err = ( msg ) => {
	throw new Error( msg );
};

Dizzle.log = function() {
	console.group( 'Dizzle Log : ' );
	console.log( ...arguments );
	console.groupEnd();
};

const core = Dizzle;

export default core;