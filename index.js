import { createFilter } from "rollup-pluginutils";

/**
 * Imports a SVG file and exports it as a module
 * with `default` pointing to a functional component.
 * @param {SVGiConfig} config
 */
function svgi ({ options, exclude, include = '**/*.svg' }) {
	if ( !(options && options.jsx) ) {
		throw new Error("options.jsx is required");
	}

	const filter = createFilter(include, exclude);

	return {
		name: 'svgi',
		/**
		 * @param {string} svg 
		 * @param {string} id 
		 */
		transform ( svg, id ) {
			if ( !filter(id) ) return;

			let library;
			let factory = options.factory || null;
			let $default = typeof options.default === "boolean"?
				options.default:
				true
			;
			let clean = options.clean || (
				rawSVG => (rawSVG
					.replace(/\s*<\?xml[\s\S]+?\?>\s*/, "") // Remove XML declaration
					.replace(/\s*<!DOCTYPE[\s\S]*?>\s*/i, "") // Remove DOCTYPE
					.replace(/[a-z]+\:[a-z]+\s*=\s*"[\s\S]+?"/ig, "") // Remove namespaced attributes
				)
			);

			switch ( options.jsx ) {
				case "preact":
					factory = "h";
					$default = false;
				break;
					
				case "react":
					factory = "React"
					$default = true;
				break;
			}

			if ( !factory ) {
				throw new Error("options.factory couldn't be set from the provided options");
			}

			factory = $default? factory: `{ ${factory} }`;
			library = `import ${factory} from '${options.jsx}';`

			svg = clean(svg);

			// Add props:
			svg = svg.replace(/<svg([\s\S]*?)>/ig, "<svg$1 {...props}>");

			const output = {
				code: (
					`${library}\n` +
					`export default ( props ) => (${svg});`
				),
				map: { mappings: '' }
			};

			return output;
		}
	};
}

export default svgi;

/**
 * @typedef {Object} SVGiOptions
 * @property {"preact"|"react"|string} jsx `"preact"`, `"react"` or your chosen JSX library
 * @property {string} [factory] The variable/ function being imported
 * @property {boolean} [default] Whether the import is a default or not. Defaults to `true`
 * @property {(rawSVG:string)=>string} [clean] A function that prepares the SVG output for use in JSX
 */

/**
 * @typedef {Object} SVGiConfig
 * @property {string|string[]} [exclude] Minimatch pattern(s) to exclude
 * @property {string|string[]} [include='**\/*.svg'] Minimatch pattern(s) to include
 * @property {SVGiOptions} options Map of options
 */