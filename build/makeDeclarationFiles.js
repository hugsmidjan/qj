const { srcFolder, distFolder, getEntrypoints, makeInputMap } = require('./helpers');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { relative } = require('path');

const srcPrefixRe = new RegExp('^' + srcFolder);
const tsExtRe = /\.tsx?$/;
const isTsFile = (file) => tsExtRe.test(file);

module.exports = () => {
	const declDir = require('../tsconfig.json').compilerOptions.declarationDir;
	const declDirRelative = './' + relative(distFolder, declDir) + '/';

	let path = '.';
	distFolder
		.replace(/\/$/, '')
		.split('/')
		.forEach((folder) => {
			path += '/' + folder;
			if (!existsSync(path)) {
				mkdirSync(path);
			}
		});

	const tsEntrypointMap = makeInputMap(getEntrypoints().filter(isTsFile));

	Object.entries(tsEntrypointMap).forEach(([moduleName, sourcePath]) => {
		const outFile = distFolder + '/' + moduleName + '.d.ts';
		const tscDeclFile = sourcePath
			.replace(srcPrefixRe, declDirRelative)
			.replace(tsExtRe, '');

		writeFileSync(
			outFile,
			[
				'export * from "' + tscDeclFile + '";',
				'import x from "' + tscDeclFile + '";',
				'export default x;',
				'',
			].join('\n')
		);
	});

	console.info('Created local declaration files for TypeScripted entrypoints.');
};
