'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var _createEmpty = function (original) { return original.constructor ? new original.constructor() : Object.create(null); };

// IE11 compatible no-polyfill object cloner
var _clone = function (original) {
  var clone = _createEmpty(original);
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


// Returns a clone of original object with all keys that have undefined values deleted
// Returns the original if nothing changed.
var objectClean = function (original, alsoNull) {
  var deleted;
  var clone = _createEmpty(original);
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


// Returns true if objects a and b contain 100% the same values.
var objectIsSame = function (a, b, customSameCheck) {
  if (typeof a.length === 'number' && a.length !== b.length) {
    return false;
  }
  var encountered = {};
  for (var key in b) {
    var valA = a[key];
    var valB = b[key];
    if (
      valA !== valB  &&  hasOwnProperty.call(b, key)  &&
      !(customSameCheck && valA && valB && customSameCheck(valA, valB, key))
    ) {
      return false;
    }
    encountered[key] = true;
  }
  for (var key$1 in a) {
    if ( !encountered[key$1] ) {
      return false;
    }
  }
  return true;
};


// Returns a clone of original object with only the specified keys
// Returns the original if nothing changed.
var objectOnly = function (original, keys) {
  var extra;
  var clone = _createEmpty(original);
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
var objectReplace = function (original, replacement, customSameCheck) {
    return  objectIsSame(original, replacement, customSameCheck) ?
                original:
                replacement;
};



var object = {
  clean: objectClean,
  isEmpty: objectIsEmpty,
  isSame: objectIsSame,
  only: objectOnly,
  replace: objectReplace,
  update: objectUpdate,
  without: objectWithout,
};

exports.objectClean = objectClean;
exports.objectIsEmpty = objectIsEmpty;
exports.objectIsSame = objectIsSame;
exports.objectOnly = objectOnly;
exports.objectReplace = objectReplace;
exports.objectUpdate = objectUpdate;
exports.objectWithout = objectWithout;
exports['default'] = object;
