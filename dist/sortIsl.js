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
    if (text) {
        var idxStr = '';
        var txt = text.trim()
            .replace(/[/.,()]/g, '') // remove punctutation
            .replace(/\s*-\s*/g, '-') // normalize spacing around dashes
            .replace(/(_|\s)+/g, ' ') // normalize/collapse space-characters
            .toLowerCase(); // lowercase
        var len = txt.length;
        var i = 0;
        while (i < len) {
            var chr = txt.charAt(i);
            var chrCode = abcIdx[chr];
            if (!chrCode) {
                var idx = abc.indexOf(chr);
                idx = idx > -1 ? 32 + idx : 99 + chr.charCodeAt(0);
                chrCode = abcIdx[chr] = String.fromCharCode(idx);
            }
            idxStr += chrCode;
            i++;
        }
        return idxStr;
    }
    return text;
};
var defaultGetProp = function (item) { return item + ''; };
var defaultSortFn = function (a, b) { return (a === b ? 0 : a > b ? 1 : -1); };
function sortIsl(arr, options) {
    var opts = (typeof options === 'string' || typeof options === 'number'
        ? { getProp: function (item) { return item[options] + ''; } }
        : typeof options === 'function'
            ? { getProp: options }
            : options || {});
    var getProp = opts.getProp || defaultGetProp;
    var sortFn = opts.sortFn || defaultSortFn;
    return arr
        .map(function (itm) { return [getAbcText(getProp(itm)), itm]; })
        .sort(function (a, b) { return (opts.reverse ? -1 : 1) * sortFn(a[0], b[0]); })
        .map(function (itm) { return itm[1]; });
}

module.exports = sortIsl;
