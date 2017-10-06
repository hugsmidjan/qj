// Functional Immutability helpers.
// --------------------------------------------------------
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
  for (var key in object) {
    if ( hasOwnProperty.call(object, key) ) {
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
      // IE11 compatible no-polyfill version
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



const object = {
  clean: objectClean,
  isEmpty: objectIsEmpty,
  only: objectOnly,
  update: objectUpdate,
  without: objectWithout,
};
export {
  objectClean,
  objectIsEmpty,
  objectOnly,
  objectUpdate,
  objectWithout,

  object as default,
};
