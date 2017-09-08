'use strict';

// Returns a clone of original object with newValues assigned
// Returns the original if nothing changed.
var hasOwnProperty = Object.prototype.hasOwnProperty;

function objectUpdate(original, newValues) {
  var clone;
  for (var key in newValues) {
    if ( hasOwnProperty.call(newValues, key) &&  original[key] !== newValues[key] ) {
      // IE11 compatible no-polyfill version
      if ( !clone ) {
        clone = {};
        for (var originalKey in original) {
          if ( hasOwnProperty.call(original, originalKey) ) {
            clone[originalKey] = original[originalKey];
          }
        }
      }
      clone[key] = newValues[key];
      // // Modern version:
      // clone = { ...original, ...newValues };
      // break;
    }
  }
  return clone || original;
}

module.exports = objectUpdate;
