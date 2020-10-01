import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';

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
		nodeResolve(),
		babel(),
		filesize(),
		visualizer()
	]
};
