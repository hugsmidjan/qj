// Searches for `terms` in the `prop`s of the `items` Array
// Returns a filtered array sorted according by how well the items matched the `term`

type SearchItem = string | object;

type TempResultsArray<Item> = Array<{ item: Item; score: number }>;

type TextGetter<Item> = (obj: Item) => string;

export type TextSearchProps<Item extends SearchItem> = {
  // Array of items to search.
  items: Array<Item>;
  // Space-delimited search terms to be individually applied
  term: string;
  // Indicate that the search strings have been pre-normalized (i.e. trimmed, lower-cased, etc.)
  normalized?: boolean;
} & (Item extends string // Name of item prop to search, or a function to extract the string to search.
  ? { prop?: TextGetter<Item> }
  : { prop: TextGetter<Item> | keyof Item });

// Helper function to prepare a String for the search function
const normalizeText = (str: string | Array<string>): string =>
  (typeof str === 'string' ? str : str.join(' '))
    .replace(/\u00ad/g, '') // remove soft-hyphens
    .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
    .trim()
    .toLowerCase();

const textSearch = <Item extends SearchItem>(
  props: TextSearchProps<Item>
): Array<Item> => {
  const { items, prop, normalized } = props;

  const term = props.term && props.term.trim();
  if (!term) {
    return items;
  }
  const terms = term.toLowerCase().split(/\s+/);
  const results: TempResultsArray<Item> = [];
  const getSearchText: TextGetter<Item> = !prop
    ? (item) => (typeof item === 'string' ? item : '')
    : typeof prop === 'function'
    ? (prop as TextGetter<Item>) // Redundant tuypecast because the conditionality of `TextSearchProps.prop` confuses tsc
    : (item) => (typeof item !== 'string' ? String(item[prop]) || '' : '');

  items.forEach((item) => {
    let searchText = getSearchText(item);
    if (!normalized) {
      searchText = normalizeText(searchText);
    }
    searchText = ' ' + searchText + ' ';
    let score = 0;
    terms.forEach((fragment) => {
      const pos = searchText.indexOf(fragment);
      if (pos > 0) {
        const startsWith = pos === 1;
        const wordStart = startsWith || searchText.charAt(pos - 1) === ' ';
        const wholeWord = wordStart && searchText.charAt(pos + fragment.length) === ' ';
        score +=
          wholeWord && startsWith
            ? 10000
            : wholeWord
            ? 1000
            : startsWith
            ? 100
            : wordStart
            ? 10
            : 1;
      }
    });
    if (score > 0) {
      results.push({ item, score });
    }
  });
  results.sort((a, b) => (a.score < b.score ? 1 : a.score > b.score ? -1 : 0));
  return results.map((result) => result.item);
};

textSearch.normalize = normalizeText;

export default textSearch;
