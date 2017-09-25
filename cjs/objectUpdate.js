'use strict';

// Functional Immutability helpers.
// --------------------------------------------------------
// import './polyfills/Object.assign';

// IE11 compatible no-polyfill object cloner
var _clone = function (original) {
  var clone = {};
  for (var originalKey in original) {
    if ( hasOwnProperty.call(original, originalKey) ) {
      clone[originalKey] = original[originalKey];
    }
  }
  return clone;
};
var hasOwnProperty = Object.prototype.hasOwnProperty;



// Returns a clone of original object with newValues assigned
// Returns the original if nothing changed.
var objectUpdate = function (original, newValues) {
  var clone;
  for (var key in newValues) {
    if ( hasOwnProperty.call(newValues, key) &&  original[key] !== newValues[key] ) {
      // IE11 compatible no-polyfill version
      clone = clone || _clone(original);
      clone[key] = newValues[key];
      // // Modern
      // clone = Object.assign({}, original, newValues);
      // break;
      // // Ultra modern
      // clone = { ...original, ...newValues };
      // break;
    }
  }
  return clone || original;
};

console.warn('Module "qj/objectUpdate" is depricated.\n `import { objectUpdate } from "qj/object";` instead.');

module.exports = objectUpdate;
