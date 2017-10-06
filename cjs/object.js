'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Functional Immutability helpers.
// --------------------------------------------------------
// import './polyfills/Object.assign';

// IE11 compatible no-polyfill object cloner
var _clone = function (original) {
  var clone = {};
  for (var originalKey in original) {
    if ( hasOwnProperty.call(original, originalKey) ) {
      clone[originalKey] = original[originalKey];
    }
  }
  return clone;
};
var hasOwnProperty = Object.prototype.hasOwnProperty;



// Returns a clone of original object with newValues assigned
// Returns the original if nothing changed.
var objectUpdate = function (original, newValues) {
  var clone;
  for (var key in newValues) {
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


// Returns true if object as no properties of its own
var objectIsEmpty = function (object) {
  for (var key in object) {
    if ( hasOwnProperty.call(object, key) ) {
      return false;
    }
  }
  return true;
};


// Returns a clone of original object with only the specified keys
// Returns the original if nothing changed.
var objectOnly = function (original, keys) {
  var extra;
  var clone = {};
  for (var key in original) {
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
var objectWithout = function (original, keys) {
  var clone;
  var numKeys = keys.length;
  for (var i=0; i<numKeys; i++) {
    var key = keys[i];
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



var object = {
  clean: objectClean,
  isEmpty: objectIsEmpty,
  only: objectOnly,
  update: objectUpdate,
  without: objectWithout,
};

exports.objectClean = objectClean;
exports.objectIsEmpty = objectIsEmpty;
exports.objectOnly = objectOnly;
exports.objectUpdate = objectUpdate;
exports.objectWithout = objectWithout;
exports['default'] = object;
