let deprecated = {
	'jsx': null,
	'factory': null,
	'default': 'isDefault',
	'clean': null,
};
let warned = false;
let warnings = [];

function deprecationWarning ( warn, options ) {
	if ( options ) {
		for ( const deprecation in deprecated ) {
			const recommended = deprecated[deprecation] || deprecation;

			if ( warned && warnings.length ) {
				warn(recommended);
				continue;
			}
		
			if ( deprecation in options ) {
				let warning = `options.${deprecation} is deprecated. Use ${recommended} instead`;

				if ( !warned ) {
					warnings.push(warning);
				}

				warn(warning);
			}
		}
	}

	if ( !warned && warnings.length ) {
		deprecated = warnings;
	}

	warned = true;
}



export default deprecationWarning;