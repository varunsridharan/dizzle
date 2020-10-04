export default function( elements, totalFound, token ) {
	var val = token.data < 0 ? token.data + totalFound : token.data;
	return [ elements[ val ] ];
}
