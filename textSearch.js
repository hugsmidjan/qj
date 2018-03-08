// Searches for `terms` in the `prop`s of the `items` Array
// Returns a filtered array sorted according by how well the items matched the `term`
const textSearch = (props) => {
  let {
    items, // Array of items (Strings or Objects) to search.
    term, // String of space-delimited ,individually applied search terms
    prop, // (Optional) String name of item prop to search, or an (Object)=>String function to extract the string to search.
    normalized, // Boolean flag to indicate that the search strings have been pre-normalized (i.e. trimmed, lower-cased, etc.)
  } = props;

  term = term.trim();
  if ( !term ) {
    return items;
  }
  const terms = term.toLowerCase().split(/\s+/);
  const results = [];
  items.forEach((item, idx) => {
    let searchText =  !prop ?
                          item:
                      prop.apply ?
                          prop(item):
                          item[prop];
    if ( !normalized ) {
      searchText = normalizeText(searchText);
    }
    searchText = ' '+searchText+' ';
    let score = 0;
    terms.forEach((fragment) => {
      const pos = searchText.indexOf(fragment);
      if ( pos > 0 ) {
        const startsWith = pos === 1;
        const wordStart = startsWith || searchText.charAt(pos - 1) === ' ';
        const wholeWord = wordStart  &&  searchText.charAt(pos + fragment.length) === ' ';
        score +=  wholeWord && startsWith ? 10000 :
                  wholeWord ? 1000 :
                  startsWith ? 100 :
                  wordStart ? 10 :
                  1;
      }
    });
    if ( score > 0 ) {
      results.push({ item, score, idx });
    }
  });
  results.sort((a,b) => (
    a.score < b.score ? 1:
    a.score > b.score ? -1:
    a.idx < b.idx ? -1 : 1 // fix Chrome's unstable sort
  ));
  return results.map((result) => result.item);
};


// Helper function to prepare a String for the search function
const normalizeText = (string) => (
  (string.join ? string.join(' ') : string)
      .replace(/\u00ad/g, '') // remove soft-hyphens
      .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
      .trim()
      .toLowerCase()
);
textSearch.normalize = normalizeText;


export default textSearch;
