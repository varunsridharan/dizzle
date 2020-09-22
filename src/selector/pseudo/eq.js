export default function( result, totalFound, token ) {
	return [ token.data < 0 ? token.data + totalFound : token.data ];
}