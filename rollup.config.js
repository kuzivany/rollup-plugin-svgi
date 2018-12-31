import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';

const pkg = require('./package');
const outputDir = join('.', 'dist');

// dist:
const README = 'README.md';

if ( !existsSync(outputDir) ) {
	mkdirSync(outputDir);
}

delete pkg.scripts;
delete pkg.devDependencies;
writeFileSync(join(outputDir, 'package.json'), JSON.stringify(pkg, null, 2));
copyFileSync(join('.', README), join(outputDir, README));
// dist;

export default {
	input: 'index.js',
	output: [
		{
			file: join(outputDir, pkg.main),
			format: 'cjs'
		},
		{
			file: join(outputDir, pkg.module),
			format: 'esm'
		}
	]
}