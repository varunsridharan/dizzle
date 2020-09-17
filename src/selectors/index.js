import core from "../setup";
import FindID from "./find/ID";
import FindTAG from "./find/TAG";
import FindNAME from "./find/NAME";
import FindclassAttr from "./find/classAttr";
import Pseudonot from "./pseudos/not";
import Pseudohas from "./pseudos/has";
import Pseudocontains from "./pseudos/contains";
import Pseudoselected from "./pseudos/selected";
import Pseudoparent from "./pseudos/parent";
import Pseudoheader from "./pseudos/header";
import Pseudobutton from "./pseudos/button";
import Pseudotext from "./pseudos/text";
import Pseudoinput from "./pseudos/input";
import Pseudoactive from "./pseudos/active";
import Pseudofocus from "./pseudos/focus";

core.selectors.find = {
	'ID': FindID,
	'TAG': FindTAG,
	'NAME': FindNAME,
	'CLASS': FindclassAttr,
};

core.selectors.pseudos = {
	'not': Pseudonot,
	'has': Pseudohas,
	'contains': Pseudocontains,
	'selected': Pseudoselected,
	'parent': Pseudoparent,
	'header': Pseudoheader,
	'button': Pseudobutton,
	'text': Pseudotext,
	'input': Pseudoinput,
	'focus': Pseudofocus,
	'active': Pseudoactive,
};