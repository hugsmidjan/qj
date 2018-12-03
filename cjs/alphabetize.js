'use strict';

var sortIsl = require('./sortIsl.js');

var supportsIcelandic;

var langAliases = {
  no: 'nb', // 'no' doesn't work in Chrome, but 'nb' does
};

function alphabetize(arr, lang, getProp) {
  getProp = getProp || (function (item) { return item; });

  if ( typeof getProp === 'string' ) {
    var prop = getProp;
    getProp = function (item) { return item[prop]; };
  }
  if (
    lang !== 'is' || supportsIcelandic === true ||
    (
      supportsIcelandic !== false && // This means it's not tested yet
      !!(supportsIcelandic = 'ð'.localeCompare('e','is') < 0 && 'ob'.localeCompare('öa','is') < 0)
    )
  ) {
    var newArr = arr.map(function (item, idx) { return ({ value: ''+getProp(item), idx: idx }); });
    lang = langAliases[lang] || lang;
    newArr.sort( function (a,b) {
      return a.value.localeCompare(b.value, lang, {
        sensitivity: 'accent',
        ignorePunctuation: true,
        numeric: true,
      });
    });
    return newArr.map(function (item) { return arr[item.idx]; });
  }
  else {
    return sortIsl( arr, { getProp: getProp } );
  }
}

module.exports = alphabetize;
