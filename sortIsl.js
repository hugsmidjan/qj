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
              .replace(/[/.,()]/g, '') // remove punctutation
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

export default function sortIsl( arr, opts ) {
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
