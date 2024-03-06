import sortIsl from './sortIsl';

let supportsIcelandic: boolean | undefined;

const envHasIcelandicSupport = () =>
  'ð'.localeCompare('e', 'is') < 0 && 'ob'.localeCompare('öa', 'is') < 0;

const langAliases: Record<string, string> = {
  no: 'nb', // 'no' doesn't work in Chrome, but 'nb' does
};

type ToStringer<T> = (item: T) => string;

/**
 * Sorts an array of strings or objects in alpha1betic order, using
 * `.localeCompare()` by default but using a custom function for Icelandic
 * sorting in Chrome (as long as Chrome doesn't support Icelandic sorting).
 *
 * It also fixes a known issue in Chrome where lang="no" doesn't work but
 * lang="nb" does.
 */
function alphabetize<T extends object, K extends keyof T>(
  /** The array to sort */
  arr: Array<T>,
  /** The two-letter language code to sort by */
  lang: string,
  /** The name of the item key to sort by */
  getProp?: K
): Array<T>;
function alphabetize<T extends object | string | number>(
  /** The array to sort */
  arr: Array<T>,
  /** The two-letter language code to sort by */
  lang: string,
  /**
   * Callback that returns the string representation of each item in the array
   * to sort by.
   */
  getProp?: ToStringer<T>
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
    (supportsIcelandic === undefined && // This means it's not tested yet
      (supportsIcelandic = envHasIcelandicSupport()))
  ) {
    lang = langAliases[lang] || lang;
    return arr
      .map((item) => ({ value: _getProp(item), item }))
      .sort((a, b) =>
        a.value.localeCompare(b.value, lang, {
          sensitivity: 'accent',
          ignorePunctuation: true,
          numeric: true,
        })
      )
      .map((item) => item.item);
  } else {
    return sortIsl(arr, { getProp: _getProp });
  }
}

export default alphabetize;
