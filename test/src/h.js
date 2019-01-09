// From https://jasonformat.com/wtf-is-jsx/#letsbuildajsxrenderer
export function h ( nodeName, attributes, ...args ) {  
	let children = args.length? [].concat(...args): null;
	return { nodeName, attributes, children };
}