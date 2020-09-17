export default function( tag, context ) {
	if( context.getElementsByName ) {
		return context.getElementsByName( name );
	}
}