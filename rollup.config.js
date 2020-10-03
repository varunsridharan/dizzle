import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";

const outputName    = 'dizzle';
const inputFile     = './src/index.js';
const outputFile    = './dist/dizzle.';
const replaceVals   = {
	'__VERSION__': pkg.version,
};
const commonPlugins = [
	replace( replaceVals ),
	nodeResolve(),
	babel(),
	filesize(),
	visualizer()
];

export default [
	{
		input: inputFile,
		plugins: commonPlugins,
		external: [ '@varunsridharan/js-is', '@varunsridharan/js-vars' ],
		output: {
			file: `${outputFile}es.js`,
			name: outputName,
			format: 'es'
		}

	},
	{
		input: inputFile,
		plugins: commonPlugins,
		output: [
			{
				file: `${outputFile}umd.js`,
				format: 'umd',
				name: outputName,
			},
			{
				file: `${outputFile}umd.min.js`,
				format: 'umd',
				name: outputName,
				plugins: [
					uglify( { mangle: true } ),
				]
			}
		],
	}
];
