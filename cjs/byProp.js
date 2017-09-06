'use strict';

// Convert arry into an object keyed by prop.
// Prop values are assumed to be unique.
// Array items with repeated keys (prop value) are skipped
function byProp( arr, prop ) {
  var obj = {};
  arr.forEach(function (item) {
    var key = item[prop];
    if ( !(key in obj) ) {
      obj[key] = item;
    }
  });
  return obj;
}

module.exports = byProp;
