import parse from "./core/parse";
import engine from "./engine";

function Dizzle() {
}

Dizzle.error = ( msg ) => {
	throw new Error( msg );
};

Dizzle.log = function() {
	console.group( 'Dizzle Log : ' );
	console.log( ...arguments );
	console.groupEnd();
};

Dizzle.parse = parse;
Dizzle.find  = engine;
const core = Dizzle;
export default core;