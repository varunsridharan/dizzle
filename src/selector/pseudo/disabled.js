export default function( elem ) {
	let disabled = true;

	// Only certain elements can match :enabled or :disabled
	// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
	// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
	if( 'form' in elem ) {

		// Check for inherited disabledness on relevant non-disabled elements:
		// * listed form-associated elements in a disabled fieldset
		//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
		//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
		// * option elements in a disabled optgroup
		//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
		// All such elements have a "form" property.
		if( elem.parentNode && elem.disabled === false ) {

			// Option elements defer to a parent optgroup if present
			if( "label" in elem ) {
				if( "label" in elem.parentNode ) {
					return elem.parentNode.disabled === disabled;
				} else {
					return elem.disabled === disabled;
				}
			}
		}

		return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
	} else if( 'label' in elem ) {
		return elem.disabled === disabled;
	}

	// Remaining elements are neither :enabled nor :disabled
	return false;

}