import core from "../../core";

export default function( elem, selector ) {
	return core( selector, elem ).length > 0;
}