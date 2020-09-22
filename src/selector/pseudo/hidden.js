import visible from "./visible";

export default function( elem ) {
	return !( visible( elem ) );
}