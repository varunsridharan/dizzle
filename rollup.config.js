import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import license from 'rollup-plugin-license';
import json from "@rollup/plugin-json";

const inputFile = './src/index.js';
const files     = [
	{ input: inputFile, format: 'es' },
	{ input: inputFile, format: 'umd' },
	{ input: inputFile, format: 'umd', minify: true, }
];
const config    = files.map( ( { input, format, minify } ) => {
	return {
		input: input,
		output: {
			file: `./dist/dizzle.${format}${minify ? '.min' : ''}.js`,
			format: format,
			name: 'dizzle',
			sourcemap: true,
		},
		plugins: [
			json(),
			nodeResolve(),
			babel( { babelHelpers: 'bundled' } ),
			minify && compiler(),
			minify && terser( {
				output: {
					beautify: false,
					quote_style: 1,
				},
				mangle: true
			} ),
			license( {
				banner: `${pkg.name} v${pkg.version} | <%= moment().format('DD-MM-YYYY') %> - MIT License`
			} ),
			filesize(),
			visualizer( {
				sourcemap: true,
				filename: `stats/${format}${minify ? '.min' : ''}.html`,
			} )
		].filter( Boolean ),
	};
} ).flat();

export default config;
