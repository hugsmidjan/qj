'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// List-to-Array converter
function A/*::<T>*/(list/*:$Supertype<T[]> */)/*:T[] */ {
  return [].slice.call(list);
}

/*
  sortIsl() -- (c) 2014-2017 Hugsmiðjan ehf. - MIT/GPL
  Written by Már Örlygsson - http://mar.anomy.net

  Original at: https://gist.github.com/maranomynet/9972930

  Sorts arrays in Icelandic alphabetical order.
  Accepts an optional function for extracting the property/text to sort by.

  Example usage:

      const arr = ['1','Á','ö','bá','be','$ff','af','að','ad','ý','y'];
      const sortedArr = sortIsl(arr);
      alert( sortedArr.join('\n') );

      // use jQuery to select <tr> elements to sort
      // and convert them to an Array
      const tRows = jQuery('tbody tr').toArray();

      const getSortProp = cellElm => $(cellElm).find('td:eq(1)').text();

      // sort the array in Icelandic alphabetical order
      // by the text-value of each row's second <td> cell.
      const sortedTRows = sortIsl(tRows, getSortProp );
      // or for reverse sorting
      tRows.sortIsl({
        getProp: getSortProp,
        reverse: true
      });

      // or for custom sorting
      tRows.sortIsl({
        getProp: getSortProp,
        sortFn:  function (a,b) { a===b ? 0 : a>b ? 1 : -1; }
      });

      // re-inject the sorted rows into table.
      $(tRows[0].parentNode).append( tRows );

*/
const abcIdx = {};
const abc = '| -0123456789aáàâäåbcdðeéèêëfghiíîïjklmnoóôpqrstuúùüvwxyýÿzþæö'; // prepend list with '|' to guarantee that abc.indexOf(chr) never returns 0 (falsy)
const getAbcText = (text) => {
  if ( typeof text === 'string' ) {
    let idxStr = '';
    text = (text.trim ? text.trim() : text.replace(/^\s+|\s+$/g,''))
              .replace(/[\/.,()]/g, '') // remove punctutation
              .replace(/\s*-\s*/g,'-')  // normalize spacing around dashes
              .replace(/(_|\s)+/g,' ')  // normalize/collapse space-characters
              .toLowerCase();           // lowercase
    const len = text.length;
    let i = 0;
    while ( i < len ) {
      const chr = text.charAt(i);
      let chrCode = abcIdx[chr];
      if ( !chrCode ) {
        let idx = abc.indexOf(chr);
        idx = idx>-1 ? 32+idx : 99+chr.charCodeAt(0);
        chrCode = abcIdx[chr] = String.fromCharCode( idx );
      }
      idxStr += chrCode;
      i++;
    }
    return idxStr;
  }
  return text;
};


const defaultGetProp = (item) => item+'';
const defaultSortFn = (a,b) => a[0]===b[0] ? 0 : a[0]>b[0] ? 1 : -1;

function sortIsl( arr, opts ) {
  opts = opts || {};
  if ( typeof opts === 'string' ) {
    const propName = opts;
    opts = { getProp: (item) => item[propName] };
  }
  else if (opts.apply && opts.call) {
    opts = { getProp: opts };
  }
  const getProp = opts.getProp  ||  defaultGetProp;
  const sortFn = opts.sortFn  ||  defaultSortFn;
  return arr
      .map((itm) => [ getAbcText(getProp(itm)), itm ])
      .sort(opts.reverse ? (a,b) => -1*sortFn(a,b) : sortFn)
      .map((itm) => itm[1]);
}

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
    (supportsIcelandic !== false && !!(supportsIcelandic = 'ð'.localeCompare('e','is') < 0 && 'ob'.localeCompare('öa','is') < 0))
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
    const obj = {};
    [].forEach.call(list, prop ?
      (item) => {
        const key = item[prop];
        if ( !(key in obj) ) {
          obj[key] = item;
        }
      }:
      (item) => {
        obj[item] = (obj[item] || 0) +1;
      }
    );
    return obj;
  }
}

// DECIDE: Add support for custom find function?
//   (where the default would be the identity function)
function uniqueArray(array) {
  var result = [];
  var length = array.length;
  for (let i = 0; i < length; i++) {
    var value = array[i];
    if ( result.indexOf(value) < 0 ) {
      result.push(value);
    }
  }
  return result;
}

// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
const groupBy = (list, prop) => {
    const getProp = typeof prop === 'string' ?
        (item) => item[prop]:
        prop;

    const grouped = {};

    [].forEach.call(list, (item) => {
        const name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
};

groupBy.asArray = (list, prop) => {
    const grouped = groupBy(list, prop);
    return Object.keys(grouped).map((name) => ({
        name,
        items: grouped[name],
    }));
};

var list = {
    A,
    toArray: A,
    alphabetize,
    toObject: arrayToObject,
    dedupe: uniqueArray,
    groupBy,
};

exports.A = A;
exports.toArray = A;
exports.alphabetize = alphabetize;
exports.toObject = arrayToObject;
exports.dedupe = uniqueArray;
exports.groupBy = groupBy;
exports.default = list;
