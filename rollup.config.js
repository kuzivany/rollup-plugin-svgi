import pkg from './package.json';

export default {
	input: 'src/rollup-plugin-svgi.mjs',
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' },
	],
	external: Object.keys(pkg.dependencies),
}
