const { makeInputMap, getEntrypoints, distFolder } = require('./buildHelpers');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { relative } = require('path');

const srcFolder = 'src';
const srcPrefixRe = new RegExp('^' + srcFolder + '/');
const tsExtRe = /\.tsx?$/;

module.exports = () => {
  const declDirRelative =
    './' +
    relative(distFolder, require('../tsconfig.json').compilerOptions.declarationDir);

  let path = '.';
  distFolder.split('/').forEach((folder) => {
    path += '/' + folder;
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  });

  const tsEntrypoints = getEntrypoints().filter((fileName) => tsExtRe.test(fileName));

  Object.entries(makeInputMap(tsEntrypoints)).forEach(([moduleName, sourcePath]) => {
    const tscDeclFile = sourcePath
      .replace(srcPrefixRe, declDirRelative + '/')
      .replace(tsExtRe, '');
    const outFile = distFolder + '/' + moduleName + '.d.ts';
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
