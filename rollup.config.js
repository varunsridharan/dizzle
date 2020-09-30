import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import json from "@rollup/plugin-json";

export default {
	input: './src/index.js',
	output: [
		{
			file: './dist/dizzle.js',
			format: 'umd',
			name: 'dizzle',
		},
		{
			file: './dist/dizzle.min.js',
			format: 'umd',
			name: 'dizzle',
			plugins: [
				uglify( { mangle: true } ),
			]
		}
	],
	plugins: [
		resolve(),
		json(),
		babel( {
			exclude: 'node_modules/**'
		} ),
		commonjs(),
		filesize(),
		visualizer()
	]
};
