'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var A = require('./A.js');
var alphabetize = require('./alphabetize.js');
var arrayToObject = require('./arrayToObject.js');
var uniqueArray = require('./uniqueArray.js');
require('./sortIsl.js');

// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
const groupBy = (list, prop) => {
    const getProp = typeof prop === 'string' ?
        (item) => item[prop]:
        prop;

    const grouped = {};

    [].forEach.call(list, (item) => {
        const name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
};

groupBy.asArray = (list, prop) => {
    const grouped = groupBy(list, prop);
    return Object.keys(grouped).map((name) => ({
        name,
        items: grouped[name],
    }));
};

var list = {
    A,
    toArray: A,
    alphabetize,
    toObject: arrayToObject,
    dedupe: uniqueArray,
    groupBy,
};

exports.A = A.default;
exports.toArray = A.default;
exports.alphabetize = alphabetize.default;
exports.toObject = arrayToObject.default;
exports.dedupe = uniqueArray.default;
exports.groupBy = groupBy;
exports.default = list;
