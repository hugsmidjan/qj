'use strict';

function uniqueArray(array) {
  var result = [];
  var length = array.length;
  for (var i = 0; i < length; i++) {
    var value = array[i];
    if ( result.indexOf(value) < 0 ) {
      result.push(value);
    }
  }
  return result;
}

module.exports = uniqueArray;
