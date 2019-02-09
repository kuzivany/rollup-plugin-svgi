import { createFilter } from 'rollup-pluginutils';

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
			let cleanedSVG;
			let factory = options.factory || null;
			let pragma = options.pragma || null;
			let isDefault = typeof options.default === "boolean"?
				options.default:
				true
			;
			let clean = options.clean || (
				rawSVG => (rawSVG
					.replace(/\s*<\?xml[\s\S]+?\?>\s*/, "") // Remove XML declaration
					.replace(/\s*<!DOCTYPE[\s\S]*?>\s*/i, "") // Remove DOCTYPE
					.replace(/[a-z]+\:[a-z]+\s*=\s*"[\s\S]+?"/ig, "") // Remove namespaced attributes
					.replace(/\s*<!\-\-[\s\S]*?\-\->\s*/ig, "") // Remove comments
					.replace(/\s+/g, ' ') // Replace excessive whitespace
				)
			);

			switch ( options.jsx ) {
				case "preact":
					factory = "h";
					pragma = factory;
					isDefault = false;
				break;
					
				case "react":
					factory = "React";
					pragma = factory + '.createElement'
					isDefault = true;
				break;
			}

			if ( !factory ) {
				throw new Error("options.factory couldn't be set from the provided options");
			}

			if ( !pragma ) {
				throw new Error("options.pragma couldn't be set from the provided options");
			}

			factory = isDefault? factory: `{ ${factory} }`;
			library = `import ${factory} from '${options.jsx}';`;
			cleanedSVG = clean(svg);

			if ( typeof cleanedSVG !== "string" ) {
				// Check whether clean returned a Promise
				let isPromise = (
					typeof cleanedSVG === "object" && cleanedSVG.then
				);

				if ( !isPromise ) {
					throw new Error('options.clean did not return a string or Promise<string>');
				}
			} else {
				cleanedSVG = Promise.resolve(cleanedSVG);
			}

			return cleanedSVG.then(cleanedSVG => {
				// Add props:
				let props = cleanedSVG.match(/\<svg([\s\S]*?)\>/i, "$1")[1] || '';
				props = `{ ${props.replace(/\s*([^=]+)\s*=\s*("[^"]+")/g, "'$1': $2,")} }`
				cleanedSVG = cleanedSVG.replace(/^\<svg([\s\S]*?)\>|\s*\<\/svg\>\s*$/ig, '');

				console.log('PROPS>', props)
	
				return {
					code: (
						`${library}\n` +
						`export default function ( props ) {` + // 
							`props.dangerouslySetInnerHTML = { __html: ${JSON.stringify(cleanedSVG)} };` +
							`return ${pragma}(` +
								`'svg',` +
								`Object.assign(${props}, props)` +
							`);` +
						`}`
					),
					map: { mappings: '' }
				};
			})
		}
	};
}

export default svgi;

/**
 * @typedef {Object} SVGiConfig
 * @property {string|string[]} [exclude] Minimatch pattern(s) to exclude
 * @property {string|string[]} [include='**\/*.svg'] Minimatch pattern(s) to include
 * @property {SVGiOptions} options Map of options
 */

/**
 * @typedef {Object} SVGiOptions
 * @property {"preact"|"react"|string} jsx `"preact"`, `"react"` or your chosen JSX library
 * @property {string} [factory] The default or named exports of the chosen library
 * @property {string} [pragma] The JSX pragma
 * @property {boolean} [default] Whether the `export` is a `default` or not. Defaults to `true`
 * @property {SVGiCleanFunction} [clean] A function that prepares the SVG output for use in JSX
 */

/**
 * @callback SVGiCleanFunction
 * @param {string} rawSVG The raw SVG file contents as a string
 * @returns {string|Promise<string>}
 */