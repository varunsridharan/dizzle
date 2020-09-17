export default function( className, context, xml ) {
	if( context.getElementsByClassName && !xml ) {
		return context.getElementsByClassName( className );
	}
}