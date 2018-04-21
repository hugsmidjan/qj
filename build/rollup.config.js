import fs from 'fs';

const getJsFiles = (path) => fs.readdirSync(path)
    .filter((fileName) => /\.js$/.test(fileName))
    .map((fileName) => path + fileName);

const distPath = './cjs/';


export default getJsFiles('./').map((filePath) => ({
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
