import fs from 'fs';

const getJsFiles = (path) => fs.readdirSync(path)
    .filter((fileName) => /\.js$/.test(fileName))
    .map((fileName) => path + fileName);

const distPath = './cjs/';


const libConfigs = getJsFiles('./').map((filePath) => ({
    input: filePath,
    output: {
        format: 'cjs',
        sourcemap: false,
        file: distPath+filePath.substr(2),
    },
    watch: {
        clearScreen: false,
    },
}));

const testConfigs = getJsFiles('./tests/').map((filePath) => ({
    input: filePath,
    external: (id) => id !== filePath,
    output: {
        format: 'cjs',
        sourcemap: false,
        interop: false,
        file: distPath+filePath.substr(2),
    },
    watch: {
        clearScreen: false,
    },
}));


export default libConfigs.concat(testConfigs);