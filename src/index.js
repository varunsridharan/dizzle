import Dizzle from "./dizzle";
import parse from "./parser/parse";
import engine from "./engine";
import combinators from "./selector/combinators";
import { pesudoHandlers } from "./selector/pseudo";
import { attrHandlers } from "./selector/attr";
import { setupMatcherFn } from "./selector/matcher";
import is from "./is";
import filter from "./filter";

Dizzle.parse       = parse;
Dizzle.find        = engine;
Dizzle.cacheLength = 50;
Dizzle.combinators = combinators;
Dizzle.pesudo      = pesudoHandlers;
Dizzle.attr        = attrHandlers;
Dizzle.is          = is;
Dizzle.filter      = filter;
setupMatcherFn();

export default Dizzle;
