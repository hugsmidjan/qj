var rollup = require('rollup').rollup;
// var nodeResolve = require('rollup-plugin-node-resolve');
var buble = require('rollup-plugin-buble');

var fs = require('fs');
var srcPath = './';
var distPath = './cjs/';

fs.readdirSync(srcPath)
    .filter(function (fileName) {
      return /\.js$/.test(fileName);
    })
    .forEach(function (fileName) {
      rollup({
        input: srcPath+fileName,
        plugins: [
          buble(),
          // nodeResolve(),
        ],
      })
          .then(function (bundle) {
            return bundle.write({
              format: 'cjs',
              sourcemap: false,
              file: distPath+fileName,
            });
          });
    });
