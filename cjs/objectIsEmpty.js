'use strict';

// Functional Immutability helpers.
// --------------------------------------------------------
// Small, fast, stupid, practical, & care-free.
// False-positives (like NaN and 0 v -0) considered acceptable.

// INFO: Interesting 3rd party deep equals helpers.
//  * https://github.com/ReactiveSets/toubkal/blob/master/lib/util/value_equals.js
//    (https://github.com/ReactiveSets/toubkal/blob/1b73baf288385b34727ddf6d223f62c3bb2cb176/lib/util/value_equals.js)
//  * https://github.com/lodash/lodash/blob/es/_baseIsEqual.js
//   (https://github.com/lodash/lodash/blob/f71a7a04b51bd761683e4a774c5b1d38bdaa7b20/_baseIsEqual.js)

// import './polyfills/Object.assign';

// IE11 compatible no-polyfill object cloner
var hasOwnProperty = Object.prototype.hasOwnProperty;



// Returns true if object as no properties of its own
var objectIsEmpty = function (object) {
  for (var key in object) {
    if ( hasOwnProperty.call(object, key) ) {
      return false;
    }
  }
  return true;
};

console.warn('Module "qj/objectIsEmpty" is depricated.\n `import { objectIsEmpty } from "qj/object";` instead.');

module.exports = objectIsEmpty;
