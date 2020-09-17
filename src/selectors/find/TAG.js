export default function( tag, context ) {
	if( context.getElementsByTagName ) {
		return context.getElementsByTagName( tag );
	}
}