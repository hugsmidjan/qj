import sortIsl from './sortIsl';
let supportsIcelandic: boolean;

const langAliases: Record<string, string> = {
	no: 'nb', // 'no' doesn't work in Chrome, but 'nb' does
};

type ToStringer<T> = (item: T) => string;

function alphabetize<T extends object, K extends keyof T>(
	arr: Array<T>,
	lang: string,
	getProp?: K
): Array<T>;
function alphabetize<T extends object | string | number>(
	arr: Array<T>,
	lang: string,
	options?: ToStringer<T>
): Array<T>;

function alphabetize<T extends string | number | object, K extends keyof T>(
	arr: Array<T>,
	lang: string,
	getProp?: K | ToStringer<T>
): Array<T> {
	const _getProp: ToStringer<T> =
		typeof getProp === 'function'
			? getProp
			: getProp != null
			? (item) => item[getProp] + ''
			: (item: T) => item + '';

	if (
		lang !== 'is' ||
		supportsIcelandic ||
		(supportsIcelandic !== false && // This means it's not tested yet
			!!(supportsIcelandic =
				'ð'.localeCompare('e', 'is') < 0 && 'ob'.localeCompare('öa', 'is') < 0))
	) {
		const newArr = arr.map((item, idx) => ({ value: _getProp(item), idx }));
		lang = langAliases[lang] || lang;
		newArr.sort((a, b) => {
			return a.value.localeCompare(b.value, lang, {
				sensitivity: 'accent',
				ignorePunctuation: true,
				numeric: true,
			});
		});
		return newArr.map((item) => arr[item.idx]);
	} else {
		return sortIsl(arr, { getProp: _getProp });
	}
}

export default alphabetize;
