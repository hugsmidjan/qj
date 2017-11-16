'use strict';

// Functional Immutability helpers.
// --------------------------------------------------------
// Small, fast, stupid, practical, & care-free.
// False-positives (like NaN and 0 v -0) considered acceptable.

// NOTE: All of the methods should be safe for Arrays too
// ...while perhaps not optimally performant in all cases.

// INFO: Interesting 3rd party deep equals helpers.
//  * https://github.com/ReactiveSets/toubkal/blob/master/lib/util/value_equals.js
//    (https://github.com/ReactiveSets/toubkal/blob/1b73baf288385b34727ddf6d223f62c3bb2cb176/lib/util/value_equals.js)
//  * https://github.com/lodash/lodash/blob/es/_baseIsEqual.js
//   (https://github.com/lodash/lodash/blob/f71a7a04b51bd761683e4a774c5b1d38bdaa7b20/_baseIsEqual.js)

// import './polyfills/Object.assign';

// IE11 compatible no-polyfill object cloner
var _clone = function (original) {
  var clone = new original.constructor();
  for (var originalKey in original) {
    if ( hasOwnProperty.call(original, originalKey) ) {
      clone[originalKey] = original[originalKey];
    }
  }
  return clone;
};
var hasOwnProperty = Object.prototype.hasOwnProperty;



// Returns a clone of original object with only the changed newValues assigned
// Returns the original if nothing changed.
var objectUpdate = function (original, newValues, customSameCheck) {
  var clone;
  for (var key in newValues) {
    var valA = original[key];
    var valB = newValues[key];
    if (
      valA !== valB  &&  hasOwnProperty.call(newValues, key)  &&
      !(customSameCheck && valA && valB && customSameCheck(valA, valB, key))
    ) {
      // Fast IE11 compatible no-polyfill version
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
