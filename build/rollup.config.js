import fs from 'fs';

const getJsFiles = (...paths) => {
    let allFiles = [];
    paths.forEach((path) => {
        path = path || '.';
        const files = fs.readdirSync(path)
            .filter((fileName) => /\.js$/.test(fileName))
            .map((fileName) => path + '/' + fileName);
        allFiles = allFiles.concat(files);
    });
    return allFiles;
};
const getJsFileMap = (...paths) => {
    const fileMap = {};
    getJsFiles(...paths).forEach((fileName) => {
        fileMap[fileName.replace(/\.js$/,'')] = fileName;
    });
    return fileMap;
};



export default [
    {
        input: getJsFileMap('.', 'polyfills'),
        output: {
            format: 'cjs',
            dir: 'cjs',
        },
        experimentalCodeSplitting: true,
        watch: {
            // clearScreen: false,
        },
    },
].concat(
    getJsFiles('tests').map((fileName) => ({
        input: fileName,
        external: ['ospec'],
        output: {
            file: 'cjs/_' + fileName,
            format: 'cjs',
        },
        watch: {
            // clearScreen: false,
        },
    }))
);
