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

var textSearch = /*::<Item:string|{}>*/function (props/*:TextSearchProps<Item>*/)/*:Array<Item>*/ {
    var items = props.items;
    var term = props.term;
    var prop = props.prop;
    var normalized = props.normalized;

    term = term && term.trim();
    if ( !term ) {
        return items;
    }
    var terms = term.toLowerCase().split(/\s+/);
    var results = [];
    var getSearchText/*:(item:Item) => string*/ = (
        !prop ?
            function (item) { return (typeof item === 'string' ? item : ''); }:
        typeof prop === 'string' ?
            function (item) { return (typeof item !== 'string' ? String(item[prop]) : ''); }:
            prop
    );
    items.forEach(function (item, idx) {
        var searchText = getSearchText(item);
        if ( !normalized ) {
            searchText = normalizeText(searchText);
        }
        searchText = ' '+searchText+' ';
        var score = 0;
        terms.forEach(function (fragment) {
            var pos = searchText.indexOf(fragment);
            if ( pos > 0 ) {
                var startsWith = pos === 1;
                var wordStart = startsWith || searchText.charAt(pos - 1) === ' ';
                var wholeWord = wordStart  &&  searchText.charAt(pos + fragment.length) === ' ';
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
            results.push({ item: item, score: score, idx: idx });
        }
    });
    results.sort(function (a,b) { return (
        a.score < b.score ? 1:
        a.score > b.score ? -1:
        a.idx < b.idx ? -1 : 1 // fix Chrome's unstable sort
    ); });
    return results.map(function (result) { return result.item; });
};


// Helper function to prepare a String for the search function
var normalizeText = function (string/*:string|Array<string>*/)/*:string*/ { return (
    (typeof string === 'string' ? string : string.join(' '))
        .replace(/\u00ad/g, '') // remove soft-hyphens
        .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
        .trim()
        .toLowerCase()
); };
textSearch.normalize = normalizeText;

module.exports = textSearch;
