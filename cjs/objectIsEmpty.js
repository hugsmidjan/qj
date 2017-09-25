'use strict';

// Functional Immutability helpers.
// --------------------------------------------------------
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
