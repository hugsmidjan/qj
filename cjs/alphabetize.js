'use strict';

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
var abcIdx = {};
var abc = '| -0123456789aáàâäåbcdðeéèêëfghiíîïjklmnoóôpqrstuúùüvwxyýÿzþæö'; // prepend list with '|' to guarantee that abc.indexOf(chr) never returns 0 (falsy)
var getAbcText = function (text) {
  if ( typeof text === 'string' ) {
    var idxStr = '';
    text = (text.trim ? text.trim() : text.replace(/^\s+|\s+$/g,''))
              .replace(/[\/.,()]/g, '') // remove punctutation
              .replace(/\s*-\s*/g,'-')  // normalize spacing around dashes
              .replace(/(_|\s)+/g,' ')  // normalize/collapse space-characters
              .toLowerCase();           // lowercase
    var len = text.length;
    var i = 0;
    while ( i < len ) {
      var chr = text.charAt(i);
      var chrCode = abcIdx[chr];
      if ( !chrCode ) {
        var idx = abc.indexOf(chr);
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


function sortIsl( arr, opts ) {
  opts = opts || {};
  if ( typeof opts === 'string' ) {
    var propName = opts;
    opts = { getProp: function (item) { return item[propName]; } };
  }
  else if (opts.apply && opts.call) {
    opts = { getProp: opts };
  }

  var getProp = opts.getProp  ||  (function (item) { return ''+item; });
  var sortFn = opts.sortFn  ||  (function (a,b) { return a[0]===b[0] ? 0 : a[0]>b[0] ? 1 : -1; });

  var tempArr = [];
  var len = arr.length;
  var i = 0;
  while ( i<len ) {
    tempArr[i] = [ getAbcText(getProp( arr[i] )), arr[i] ];
    i++;
  }
  tempArr.sort(
      opts.reverse ?
          function (a,b) { return -1 * sortFn(a,b); }:
          sortFn
    );
  i = 0;
  while ( i<len ) {
    arr[i] = tempArr[i][1];
    i++;
  }
  return tempArr.map();

}

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
    lang === 'is' &&
    supportsIcelandic == null &&
    (supportsIcelandic = 'ð'.localeCompare('e','is') === -1) === false
  ) {
    return sortIsl( arr, { getProp: getProp } );
  }
  else {
    var newArr = arr.map(function (item, idx) { return ({ value: getProp(item), idx: idx }); });
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
}

module.exports = alphabetize;
