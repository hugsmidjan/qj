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
const abcIdx: Record<string, string> = {};
const abc = '| -0123456789aáàâäåbcdðeéèêëfghiíîïjklmnoóôpqrstuúùüvwxyýÿzþæö'; // prepend list with '|' to guarantee that abc.indexOf(chr) never returns 0 (falsy)

const getAbcText = (text: string): string => {
	if (text) {
		let idxStr = '';
		const txt = text
			.trim()
			.replace(/[/.,()]/g, '') // remove punctutation
			.replace(/\s*-\s*/g, '-') // normalize spacing around dashes
			.replace(/(_|\s)+/g, ' ') // normalize/collapse space-characters
			.toLowerCase(); // lowercase
		const len = txt.length;
		let i = 0;
		while (i < len) {
			const chr = txt.charAt(i);
			let chrCode = abcIdx[chr];
			if (!chrCode) {
				let idx = abc.indexOf(chr);
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

type ToStringer<T> = (item: T) => string;
type Sorter = (a: string, b: string) => -1 | 1 | 0;

export type SortIslOptions<T extends object | string | number> = {
	reverse?: boolean;
	sortFn?: Sorter;
	getProp?: ToStringer<T>;
};

const defaultGetProp: ToStringer<any> = (item: unknown) => item + '';
const defaultSortFn: Sorter = (a, b) => (a === b ? 0 : a > b ? 1 : -1);

function sortIsl<T extends object, K extends keyof T>(
	arr: Array<T>,
	options?: K
): Array<T>;
function sortIsl<T extends object | string | number>(
	arr: Array<T>,
	options?: ToStringer<T>
): Array<T>;
function sortIsl<T extends object | string | number>(
	arr: Array<T>,
	options?: SortIslOptions<T>
): Array<T>;

function sortIsl<T extends object | string | number, K extends keyof T>(
	arr: Array<T>,
	options?: string | number | ToStringer<T> | SortIslOptions<T>
): Array<T> {
	const opts = (typeof options === 'string' || typeof options === 'number'
		? { getProp: (item: T) => item[options as K] + '' }
		: typeof options === 'function'
		? { getProp: options }
		: options || {}) as SortIslOptions<T>;

	const getProp = opts.getProp || defaultGetProp;
	const sortFn = opts.sortFn || defaultSortFn;
	return arr
		.map<[string, T]>((itm) => [getAbcText(getProp(itm)), itm])
		.sort((a, b) => (opts.reverse ? -1 : 1) * sortFn(a[0], b[0]))
		.map<T>((itm) => itm[1]);
}

export default sortIsl;
