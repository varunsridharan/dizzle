import { matchExpr, } from "./regex";
import core from "./core.js";
/**
 * Find Handlers
 */
import "./find/elementsMatcher";
import "./find/filterAdapter";
import "./find/findElements";
import "./find/finder";
import "./find/searchElements";
import "./selectors/index";
import "./functions.js";

let Expr   = core.selectors;
Expr.match = matchExpr;

function SetFilters() {
}

Expr.filters    = SetFilters.prototype = Expr.pseudos;
Expr.setFilters = new SetFilters();
export default core;