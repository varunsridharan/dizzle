export default function( elements, totalFound, { data } ) {
	return [ elements[ data < 0 ? data + totalFound : data ] ];
}
