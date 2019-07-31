import buble from 'rollup-plugin-buble';
import typescript from 'rollup-plugin-typescript2';

const {
  makeInputMap,
  getEntrypoints,
  getPolyfills,
  getTests,
  distFolder
} = require('./buildHelpers');


export default [
    // Glob all src scipts – except polyfills.
    // No modules should be using polyfills.
    // polyfills are alwways strictly opt-in to minimize tech-dept
    {
        input: makeInputMap(getEntrypoints()),
        output: {
            format: 'cjs',
            dir: distFolder,
            strict: false,
        },
        plugins: [
            typescript({
              useTsconfigDeclarationDir: true,
            }),
            buble({ objectAssign: true, exclude: '**/*.ts' }),
        ],
        watch: {
            // clearScreen: false,
        },
    },
    // Handle polyfills seperately
    // No TS, ES6 or anything fancy
    {
        input: makeInputMap(getPolyfills()),
        output: {
            format: 'cjs',
            dir: distFolder + '/polyfills',
            strict: false,
        },
        watch: {
            // clearScreen: false,
        },
    },
].concat(
  getTests().map((fileName) => ({
        input: fileName,
        external: ['ospec', 'jsdom'],
        output: {
            file: '_tests/' + fileName.split('/').pop().replace(/\.ts$/, '.js'),
            format: 'cjs',
        },
      plugins: [
          typescript({
            tsconfigOverride: { compilerOptions: { declaration: false } }
          }),
      ],
      watch: {
            // clearScreen: false,
        },
    }))
);
