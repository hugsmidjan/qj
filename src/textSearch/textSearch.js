//@flow

// Searches for `terms` in the `prop`s of the `items` Array
// Returns a filtered array sorted according by how well the items matched the `term`

/*::
    type TextSearchProps<Item> = {
        items: Array<Item>,                    // Array of items to search.
        term: string,                          // Space-delimited search terms to be individually applied
        prop?: string | (obj:Item) => string,  // Name of item prop to search, or a function to extract the string to search.
        normalized?: boolean,                  // Indicate that the search strings have been pre-normalized (i.e. trimmed, lower-cased, etc.)
    };
*/

const textSearch = /*::<Item:string|{}>*/(props/*:TextSearchProps<Item>*/)/*:Array<Item>*/ => {
    let {
        items,
        term,
        prop,
        normalized,
    } = props;

    term = term && term.trim();
    if ( !term ) {
        return items;
    }
    const terms = term.toLowerCase().split(/\s+/);
    const results = [];
    const getSearchText/*:(item:Item) => string*/ = (
        !prop ?
            (item) => (typeof item === 'string' ? item : ''):
        typeof prop === 'string' ?
            (item) => (typeof item !== 'string' ? String(item[prop]) : ''):
            prop
    );
    items.forEach((item, idx) => {
        let searchText = getSearchText(item);
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
                score +=  (
                    wholeWord && startsWith ? 10000 :
                    wholeWord ? 1000 :
                    startsWith ? 100 :
                    wordStart ? 10 :
                    1
                );
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
const normalizeText = (string/*:string|Array<string>*/)/*:string*/ => (
    (typeof string === 'string' ? string : string.join(' '))
        .replace(/\u00ad/g, '') // remove soft-hyphens
        .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
        .trim()
        .toLowerCase()
);
textSearch.normalize = normalizeText;


export default textSearch;
