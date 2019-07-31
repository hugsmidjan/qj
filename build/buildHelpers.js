const glob = require('glob');

const entryPointsGlob = 'src/**/*.{js,ts}';

const polyfillsGlob = 'src/__polyfills/**/*.{js,ts}';
const testsGlob = 'src/**/*.test?(s).{js,ts}';
const privatesGlob = 'src/**/*.privates.{js,ts}'; // `*.privates.js` contain private bits that need testing
const testHelperGlob = 'src/__testing/**/*.{js,ts}';
const wipGlob = 'src/**/*.WIP.{js,ts}'; // Scripts that should not be bundled/published yet

exports.distFolder = 'dist';

exports.getEntrypoints = () =>
  glob.sync(entryPointsGlob, {
    ignore: [polyfillsGlob, wipGlob, privatesGlob, testsGlob, testHelperGlob],
  });
exports.getPolyfills = () => glob.sync(polyfillsGlob);
exports.getTests = () => glob.sync(testsGlob);

/*
  type InputMap = { [fileName:string]: string };
*/
exports.makeInputMap = (files /*: Array<string> */) /*: InputMap */ => {
  const fileMap = {};
  files.forEach((fileName) => {
    fileMap[
      fileName
        .split('/')
        .pop()
        .replace(/\.(?:js|ts)$/, '')
    ] = fileName;
  });
  return fileMap;
};
