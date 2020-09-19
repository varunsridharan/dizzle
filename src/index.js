import core from "./core";
import "./engine";
import parse from "./parser/parse";
import engine from "./engine";

core.parse = parse;
core.find  = engine;

export default core;