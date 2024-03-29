/* eslint-env node */
const glob = require('glob');

const srcFolder = 'src/';

const polyfillsSrcFolder = '__polyfills/';
const polyfillsGlob = '**/*.{js,ts}';

const scriptsGlobs = '**/*.{js,ts}';

const globs = {
  tests: '**/*.tests.{js,ts}',
  privates: '**/*.privates.{js,ts}', // `*.privates.js` contain private bits that need testing
  testHelpers: '__testing/**/*.{js,ts}',
  wip: '**/*.WIP.{js,ts}', // Scripts that should not be bundled/published yet
  polyfills: polyfillsSrcFolder + polyfillsGlob,
};

const getEntrypoints = () =>
  glob.sync(srcFolder + scriptsGlobs, {
    ignore: Object.values(globs).map((glob) => srcFolder + glob),
  });

/*
  type InputMap = { [fileName:string]: string };
*/
const makeInputMap = (files /*: Array<string> */) /*: InputMap */ => {
  const fileMap = {};
  files.forEach((fileName) => {
    fileMap[
      fileName
        .split('/')
        .pop()
        .replace(/\.[jt]sx?$/, '')
    ] = fileName;
  });
  return fileMap;
};

const scriptsBundleMap = makeInputMap(getEntrypoints());

exports.srcFolder = srcFolder;
exports.scriptsBundleMap = scriptsBundleMap;

exports.testGlobs = [globs.tests];
exports.distFolder = 'dist/';
exports.testingFolder = '__tests/';

exports.polyfillsGlobs = polyfillsGlob;
exports.polyfillsSrcFolder = srcFolder + polyfillsSrcFolder;
exports.polyfillsDistFolder = exports.distFolder + 'polyfills/';

exports.entryTokens = Object.keys(scriptsBundleMap)
  .concat(
    glob
      .sync(polyfillsGlob, { cwd: exports.polyfillsSrcFolder })
      .map((fileName) => 'polyfills/' + fileName.replace(/\.[jt]sx?$/, ''))
  )
  .sort((a, b) => a.localeCompare(b, 'en'));
