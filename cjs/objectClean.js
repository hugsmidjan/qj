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

const _createEmpty = (original) => original.constructor ? new original.constructor() : Object.create(null);
const hasOwnProperty = Object.prototype.hasOwnProperty;


// Returns a clone of original object with all keys that have undefined values deleted
// Returns the original if nothing changed.
const objectClean = (original, alsoNull) => {
  let deleted;
  const clone = _createEmpty(original);
  for (const key in original) {
    if ( hasOwnProperty.call(original, key) ) {
      const originalVal = original[key];
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
