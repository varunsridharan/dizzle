import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";

const replaceVals = {
	'__VERSION__': pkg.version,
};

export default {
	input: './src/index.js',
	output: [
		{
			file: './dist/dizzle.es.js',
			format: 'es',
			name: 'dizzle',
		},
		{
			file: './dist/dizzle.umd.js',
			format: 'umd',
			name: 'dizzle',
		},
		{
			file: './dist/dizzle.umd.min.js',
			format: 'umd',
			name: 'dizzle',
			plugins: [
				uglify( { mangle: true } ),
			]
		}
	],
	plugins: [
		replace( replaceVals ),
		nodeResolve(),
		babel(),
		filesize(),
		visualizer()
	]
};
