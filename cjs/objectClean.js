'use strict';

// Functional Immutability helpers.
// --------------------------------------------------------
// import './polyfills/Object.assign';

// IE11 compatible no-polyfill object cloner
var hasOwnProperty = Object.prototype.hasOwnProperty;



// Returns a clone of original object with all keys that have undefined values deleted
// Returns the original if nothing changed.
var objectClean = function (original, alsoNull) {
  var deleted;
  var clone = {};
  for (var key in original) {
    if ( hasOwnProperty.call(original, key) ) {
      var originalVal = original[key];
      if ( (originalVal === undefined) || (originalVal === null && alsoNull) ) {
        deleted = true;
      }
      else {
        clone[key] = originalVal;
      }
    }
  }
  return deleted ? clone : original;
};

console.warn('Module "qj/objectClean" is depricated.\n `import { objectClean } from "qj/object";` instead.');

module.exports = objectClean;
