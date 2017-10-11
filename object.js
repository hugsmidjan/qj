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
const _clone = (original) => {
  const clone = {};
  for (const originalKey in original) {
    if ( hasOwnProperty.call(original, originalKey) ) {
      clone[originalKey] = original[originalKey];
    }
  }
  return clone;
};
const hasOwnProperty = Object.prototype.hasOwnProperty;



// Returns a clone of original object with newValues assigned
// Returns the original if nothing changed.
const objectUpdate = (original, newValues) => {
  let clone;
  for (const key in newValues) {
    if ( original[key] !== newValues[key] && hasOwnProperty.call(newValues, key) ) {
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


// Returns a clone of original object with all keys that have undefined values deleted
// Returns the original if nothing changed.
const objectClean = (original, alsoNull) => {
  let deleted;
  const clone = {};
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


// Returns true if object as no properties of its own
const objectIsEmpty = (object) => {
  for (const key in object) {
    if ( hasOwnProperty.call(object, key) ) {
      return false;
    }
  }
  return true;
};


// Returns true if objects a and b contain 100% the same values.
const objectIsSame = (a, b) => {
  for (const key in b) {
    if ( a[key] !== b[key] && hasOwnProperty.call(b, key) ) {
      return false;
    }
  }
  for (const key in a) {
    if ( a[key] !== b[key] && hasOwnProperty.call(a, key) ) {
      return false;
    }
  }
  return true;
};


// Returns a clone of original object with only the specified keys
// Returns the original if nothing changed.
const objectOnly = (original, keys) => {
  let extra;
  const clone = {};
  for (const key in original) {
    if ( hasOwnProperty.call(original, key) ) {
      if ( keys.indexOf(key) > -1 ) {
        clone[key] = original[key];
      }
      else {
        extra = true;
      }
    }
  }
  return extra ? clone : original;
};


// Returns a clone of original object without the specified keys
// Returns the original if nothing changed.
const objectWithout = (original, keys) => {
  let clone;
  const numKeys = keys.length;
  for (let i=0; i<numKeys; i++) {
    const key = keys[i];
    if ( hasOwnProperty.call(original, key) ) {
      // Fast IE11 compatible no-polyfill version
      clone = clone || _clone(original);
      // // Modern
      // clone = clone || Object.assign({}, original);
      // // Ultra modern
      // clone = clone || { ...original };
      delete clone[key];
    }
  }
  return clone || original;
};


// Returns original if replacement has the same keys + values.
// Otherwise returns replacement as is.
const objectReplace = (original, replacement) => {
    return objectIsSame(original, replacement) ? original : replacement;
};



const object = {
  clean: objectClean,
  isEmpty: objectIsEmpty,
  isSame: objectIsSame,
  only: objectOnly,
  replace: objectReplace,
  update: objectUpdate,
  without: objectWithout,
};
export {
  objectClean,
  objectIsEmpty,
  objectIsSame,
  objectOnly,
  objectReplace,
  objectUpdate,
  objectWithout,

  object as default,
};
