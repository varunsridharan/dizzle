import Dizzle from "./dizzle";
import parse from "./parser/parse";
import engine from "./engine";
import combinators from "./selector/combinators";
import { pesudoHandlers } from "./selector/pseudo";
import { attrHandlers } from "./selector/attr";
import { setupMatcherFn } from "./selector/matcher";

Dizzle.parse       = parse;
Dizzle.find        = engine;
Dizzle.cacheLength = 50;
Dizzle.combinators = combinators;
Dizzle.pesudo      = pesudoHandlers;
Dizzle.attr        = attrHandlers;

setupMatcherFn();

export default Dizzle;
