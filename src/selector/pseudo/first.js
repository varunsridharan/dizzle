/**
 * This is used to select very first element.
 * and this has below alias
 * @alias first
 * @alias first-child
 * @return {[number]}
 */
export default function( elem ) {
	return ( !elem.previousElementSibling );
}