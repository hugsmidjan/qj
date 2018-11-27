//@flow
import buble from 'rollup-plugin-buble';
import glob from 'glob';
import fs from 'fs';

/*
    type FileMap = { [fileName:string]: string };
*/

const getFileMap = (files/*:Array<string>*/)/*:FileMap*/ => {
    const fileMap = {};
    files.forEach((fileName) => {
        fileMap[fileName.split('/').pop().replace(/\.js$/,'')] = fileName;
    });
    return fileMap;
};


const createFlowFiles = () => {
    let _flowFilesCreated = false;
    let files/*:FileMap*/ = {};
    return {
        options: (options/*:Object*/) => { files = options.input; },
        generateBundle: (output/*:Object*/) => {
            if ( !_flowFilesCreated ) {
                _flowFilesCreated = true;
                fs.mkdir(output.dir, undefined, (e) => {
                    if ( e ) {
                        console.error(e);
                    }
                    else {
                        Object.keys(files).forEach((fileName) => {
                            const importStr = '\'./'+files[fileName]+'\';\n';
                            const code = '//@flow\nexport * from '+importStr+'export { default } from '+importStr;
                            fs.writeFile(
                                output.dir+'/'+fileName+'.js.flow',
                                code,
                                (e) => { e && console.error(e); }
                            );
                        });
                    }
                });
            }
        },
    };
};


const polyfillsGlob = 'src/__polyfills/**/*.js';
const testsGlob = 'src/**/*.test?(s).js';
const privatesGlob = 'src/**/*.privates.js'; // `*.privates.js` contain private bits that need testing
const testHelperGlob = 'src/__testing/**/*.js';

export default [
    // Glob all src scipts – except polyfills.
    // No modules should be using polyfills.
    // polyfills are alwways strictly opt-in to minimize tech-dept
    {
        input: getFileMap(
            glob.sync(
                'src/**/*.js',
                { ignore: [polyfillsGlob, privatesGlob, testsGlob, testHelperGlob] }
            )
        ),
        output: {
            format: 'cjs',
            dir: 'dist',
            strict: false,
        },
        plugins: [
            buble({ objectAssign: true }),
            createFlowFiles(),
        ],
        experimentalCodeSplitting: true,
        watch: {
            // clearScreen: false,
        },
    },
    // Handle polyfills seperately
    // No Flow, ES6 or anything fancy
    {
        input: getFileMap(
            glob.sync(polyfillsGlob)
        ),
        output: {
            format: 'cjs',
            dir: 'dist/polyfills',
            strict: false,
        },
        experimentalCodeSplitting: true,
        watch: {
            // clearScreen: false,
        },
    },
].concat(
    // Tests can (and should!) be bundled individually
    // without experimentalCodeSplitting –
    // to appease the wonderfully KISS ospec.
    glob.sync(testsGlob).map((fileName) => ({
        input: fileName,
        external: ['ospec', 'jsdom'],
        output: {
            file: '_tests/' + fileName.split('/').pop(),
            format: 'cjs',
        },
        watch: {
            // clearScreen: false,
        },
    }))
);
