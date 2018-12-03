'use strict';

Object.assign = Object.assign || function (target) {
  var arguments$1 = arguments;

  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  var output = Object(target);
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments$1[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if ( hasOwn.call(source, nextKey) ) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
};
