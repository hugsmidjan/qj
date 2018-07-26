'use strict';

var sortIsl = require('./sortIsl.js');

let supportsIcelandic;

const langAliases = {
  no: 'nb', // 'no' doesn't work in Chrome, but 'nb' does
};

function alphabetize(arr, lang, getProp) {
  getProp = getProp || ((item) => item);

  if ( typeof getProp === 'string' ) {
    const prop = getProp;
    getProp = (item) => item[prop];
  }
  if (
    lang !== 'is' || supportsIcelandic === true ||
    (
      supportsIcelandic !== false && // This means it's not tested yet
      !!(supportsIcelandic = 'ð'.localeCompare('e','is') < 0 && 'ob'.localeCompare('öa','is') < 0)
    )
  ) {
    let newArr = arr.map((item, idx) => ({ value: ''+getProp(item), idx }));
    lang = langAliases[lang] || lang;
    newArr.sort( (a,b) => {
      return a.value.localeCompare(b.value, lang, {
        sensitivity: 'accent',
        ignorePunctuation: true,
        numeric: true,
      });
    });
    return newArr.map((item) => arr[item.idx]);
  }
  else {
    return sortIsl( arr, { getProp } );
  }
}

module.exports = alphabetize;
