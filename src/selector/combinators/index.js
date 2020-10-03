import child from "./child";
import parent from "./parent";
import adjacent from "./adjacent";
import sibling from "./sibling";
import descendant from "./descendant";

export default {
	'>': child,
	'<': parent,
	'+': adjacent,
	'~': sibling,
	' ': descendant
};
