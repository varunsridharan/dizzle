import Dizzle from "./dizzle";
import parse from "./parser/parse";
import engine from "./engine";

Dizzle.parse       = parse;
Dizzle.find        = engine;
Dizzle.cacheLength = 50;

export default Dizzle;