import { createFilter } from "rollup-pluginutils";

export default 
/**
 * `import`s a `.svg` file and `export`s it as a module with `default` pointing to a functional component.
 * @param {SVGiConfig} config
 */
( config ) => {
	if ( !(config && config.options && config.options.jsx) ) {
		throw new Error("options.jsx is required");
	}

	config.include = config.include || '**/*.svg'
	
	const filter = createFilter(config.include, config.exclude);

	return {
		name: 'svgi',
		/**
		 * @param {string} svg 
		 * @param {string} id 
		 */
		transform ( svg, id ) {
			if ( !filter(id) ) return;

			let library;
			let factory = config.options.factory || null;
			let $default = typeof config.options.default === "boolean"?
				config.options.default:
				true
			;
			
			let clean = config.options.clean || (rawSVG => (rawSVG
				.replace(/\s*<\?xml[\s\S]+?\?>\s*/, "") // Remove XML declaration
				.replace(/\s*<!DOCTYPE[\s\S]*?>\s*/i, "") // Remove DOCTYPE
				.replace(/[a-z]+\:[a-z]+\s*=\s*"[\s\S]+?"/ig, "") // Remove namespaced attributes
			));

			switch ( config.options.jsx ) {
				case "preact":
					factory = "h";
					$default = false;
				break;
					
				case "react":
					factory = "createElement"
					$default = false;
				break;
			}

			if ( !factory ) {
				throw new Error("options.factory couldn't be set from the provided options");
			}

			factory = $default? factory: `{ ${factory} }`;
			library = `import ${factory} from '${config.options.jsx}';`

			svg = clean(svg);

			// Add props:
			svg = svg.replace(/<svg([\s\S]*?)>/ig, "<svg$1 {...props}>");
			// console.log(svg)

			const output = {
				code: (
					`${library}\n` +
					`export default ( props ) => (${svg});`
				),
				map: { mappings: '' }
			};

			// console.log(output.code);
			return output;
		}
	};
}

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