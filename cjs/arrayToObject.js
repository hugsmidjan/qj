'use strict';

// Convert an array-like list into an object keyed by prop.
// Prop values are assumed to be unique.
// Array items with repeated keys (prop value) are skipped
// If prop is undefined, the Array values are used as keys
// with the value being a count of how many times each key occured
/*
  const arr1 = [
    {name:'Tim', age:12},
    {name:'Sam', age:10},
    {name:'Tim', age:29},
  ];
  console.log( arrayToObject(arr1, 'name') );
  // { Tim:{name:'Tim',age:12}, Sam:{name:'Sam',age:10} };

  const arr2 = ['Orange', 'Apple', 'Tomato', 'Apple', 'Apple'];
  console.log( arrayToObject(arr2) );
  // { Orange:1, Apple:3, Tomato:1 }

*/
function arrayToObject( list, prop ) {
  if ( list ) {
    var obj = {};
    [].forEach.call(list, prop ?
      function (item) {
        var key = item[prop];
        if ( !(key in obj) ) {
          obj[key] = item;
        }
      }:
      function (item) {
        obj[item] = (obj[item] || 0) +1;
      }
    );
    return obj;
  }
}

module.exports = arrayToObject;
