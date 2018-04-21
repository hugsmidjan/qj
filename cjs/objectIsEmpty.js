'use strict';

// Functional Immutability helpers.
const hasOwnProperty = Object.prototype.hasOwnProperty;


// Returns true if object as no properties of its own
const objectIsEmpty = (object) => {
  for (const key in object) {
    if ( hasOwnProperty.call(object, key) ) {
      return false;
    }
  }
  return true;
};

console.warn('Module "qj/objectIsEmpty" is depricated.\n `import { objectIsEmpty } from "qj/object";` instead.');

module.exports = objectIsEmpty;
