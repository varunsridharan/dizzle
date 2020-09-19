import core from "./core";
import "./engine";
import parse from "./parser/parse";
import engine from "./engine";

core.parse       = parse;
core.find        = engine;
core.cacheLength = 50;

export default core;