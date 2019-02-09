const rollup = require('rollup');
const assert = require('assert');
const { join } = require('path');
const buble = require('rollup-plugin-buble');
const svgi = require('../dist/rollup-plugin-svgi');
const h = join(__dirname, 'src', 'h.js').replace(/\\/g, '/');

const test = ( clean ) => (
	rollup.rollup({
		input: join(__dirname, 'src', 'main.js'),
		external: [h],
		plugins: [
			svgi({
				options: {
					jsx: h,
					factory: 'h',
					pragma: 'h',
					'default': false,
					clean
				},
			}),
			buble({
				jsx: 'h',
				objectAssign: 'Object.assign'
			}),
		]
	})
	.then(bundle => bundle.generate({format: 'es'}))
	.then(({ output: [generated] }) => generated)
);


describe('rollup-plugin-svgi', function () {
	it('returns a component', () => test(null).then(({ code }) => {
		// console.log(code)
		assert.ok(
			code.indexOf("function Logo ( props ) {") > -1 &&
			code.indexOf("return h('svg'") > -1
		)
	}));

	it('accepts `options.clean` which returns a Promise', () => test(
		svg => Promise.resolve(
			svg
				.replace(/\s*<\?xml[\s\S]+?\?>\s*/, "")
				.replace(/\s*<!DOCTYPE[\s\S]*?>\s*/i, "")
				.replace(/[a-z]+\:[a-z]+\s*=\s*"[\s\S]+?"/ig, "")
				.replace(/\s*<!\-\-[\s\S]*?\-\->\s*/ig, "")
		)).then(({ code }) => (
			assert.ok(
				code.indexOf("function Logo ( props ) {") > -1 &&
				code.indexOf("return h('svg'") > -1
			)
		))
	);

	it('throws on noop `options.clean`', () => test(svg => svg).catch(err => {
		assert.ok(err.message, 'Unexpected token (2:30)')
	}));
});
// .catch(err => console.log("ERR:", err))