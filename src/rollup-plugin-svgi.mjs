import { createFilter } from 'rollup-pluginutils';
import deprecated from './deprecated';

/**
 * Imports a SVG file and exports it as a module
 * with `default` pointing to a functional component.
 * @param {SVGiConfig} config
 */
function svgi ( config ) {
	const { options, exclude, include = '**/*.svg' } = config;
	const jsx = config.jsx || options.jsx || null;

	if ( !jsx ) {
		throw new Error("jsx is required");
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

			deprecated(this.warn, options);

			let library;
			let cleanedSVG;
			let factory = config.factory || options.factory || null;
			let pragma = config.pragma || options.pragma || null;
			let isDefault;
			let clean = config.clean || options.clean || (
				rawSVG => (rawSVG
					.replace(/\s*<\?xml[\s\S]+?\?>\s*/, "") // Remove XML declaration
					.replace(/\s*<!DOCTYPE[\s\S]*?>\s*/i, "") // Remove DOCTYPE
					.replace(/[a-z]+\:[a-z]+\s*=\s*"[\s\S]+?"/ig, "") // Remove namespaced attributes
					.replace(/\s*<!\-\-[\s\S]*?\-\->\s*/ig, "") // Remove comments
					.replace(/\s+/g, ' ') // Replace excessive whitespace
				)
			);
			
			if ( typeof config.isDefault === "boolean" || typeof options.default === "boolean" ) {
				isDefault = config.isDefault || options.default;
			} else {
				isDefault = true;
			}

			switch ( jsx ) {
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
				throw new Error("factory couldn't be set from the provided options");
			}

			if ( !pragma ) {
				throw new Error("pragma couldn't be set from the provided options");
			}

			factory = isDefault? factory: `{ ${factory} }`;
			library = `import ${factory} from '${jsx}';`;
			cleanedSVG = clean(svg);

			if ( typeof cleanedSVG !== "string" ) {
				// Check whether clean returned a Promise
				let isPromise = (
					typeof cleanedSVG === "object" && cleanedSVG.then
				);

				if ( !isPromise ) {
					throw new Error('clean did not return a string or Promise<string>');
				}
			} else {
				cleanedSVG = Promise.resolve(cleanedSVG);
			}

			return cleanedSVG.then(cleanedSVG => {
				// Add props:
				let props = cleanedSVG.match(/\<svg([\s\S]*?)\>/i, "$1")[1] || '';
				props = `{ ${props.replace(/\s*([^=]+)\s*=\s*("[^"]+")/g, "'$1': $2,")} }`
				cleanedSVG = cleanedSVG.replace(/^\<svg([\s\S]*?)\>|\s*\<\/svg\>\s*$/ig, '');

				// console.log('PROPS>', props)
	
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
 * @property {"preact"|"react"|string} jsx `"preact"`, `"react"` or your chosen JSX library
 * @property {string} [factory] The default or named exports of the chosen library
 * @property {string} [pragma] The JSX pragma
 * @property {boolean} [isDefault] Whether the `export` is a `default` or not. Defaults to `true`
 * @property {SVGiCleanFunction} [clean] A function that prepares the SVG output for use in JSX
 * @property {string|string[]} [exclude] Minimatch pattern(s) to exclude
 * @property {string|string[]} [include='**\/*.svg'] Minimatch pattern(s) to include
 * @property {SVGiOptions} [options] Map of options
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