'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var A = require('./A.js');
var alphabetize = require('./alphabetize.js');
var arrayToObject = require('./arrayToObject.js');
var uniqueArray = require('./uniqueArray.js');
require('./sortIsl.js');

// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
var groupBy = function (list, prop) {
    var getProp = typeof prop === 'string' ?
        function (item) { return item[prop]; }:
        prop;

    var grouped = {};

    [].forEach.call(list, function (item) {
        var name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
};

groupBy.asArray = function (list, prop) {
    var grouped = groupBy(list, prop);
    return Object.keys(grouped).map(function (name) { return ({
        name: name,
        items: grouped[name],
    }); });
};

var list = {
    A: A,
    toArray: A,
    alphabetize: alphabetize,
    toObject: arrayToObject,
    dedupe: uniqueArray,
    groupBy: groupBy,
};

exports.A = A.default;
exports.toArray = A.default;
exports.alphabetize = alphabetize.default;
exports.toObject = arrayToObject.default;
exports.dedupe = uniqueArray.default;
exports.groupBy = groupBy;
exports.default = list;
