import pkg from './package.json';

export default {
	input: pkg.module,
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		}
	],
	external: Object.keys(pkg.dependencies),
}