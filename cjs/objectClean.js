'use strict';

// Returns a clone of original object with keys with undefined values deleted
// Returns the original if nothing changed.
var hasOwnProperty = Object.prototype.hasOwnProperty;

function objectClean(original) {
  var deleted;
  var clone = {};
  for (var key in original) {
    if ( hasOwnProperty.call(original, key) ) {
      if ( original[key] !== undefined ) {
        clone[key] = original[key];
      }
      else {
        deleted = true;
      }
    }
  }
  return deleted ? clone : original;
}

module.exports = objectClean;
