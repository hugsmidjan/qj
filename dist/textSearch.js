// Searches for `terms` in the `prop`s of the `items` Array
// Returns a filtered array sorted according by how well the items matched the `term`
// Helper function to prepare a String for the search function
var normalizeText = function (str) { return ((typeof str === 'string' ? str : str.join(' '))
    .replace(/\u00ad/g, '') // remove soft-hyphens
    .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
    .trim()
    .toLowerCase()); };
var textSearch = function (props) {
    var items = props.items, prop = props.prop, normalized = props.normalized;
    var term = props.term && props.term.trim();
    if (!term) {
        return items;
    }
    var terms = term.toLowerCase().split(/\s+/);
    var results = [];
    var getSearchText = (!prop ?
        function (item) { return (typeof item === 'string' ? item : ''); } :
        typeof prop === 'function' ?
            prop : // Redundant tuypecast because the conditionality of `TextSearchProps.prop` confuses tsc
            function (item) { return (typeof item !== 'string' ? String(item[prop]) || '' : ''); });
    items.forEach(function (item) {
        var searchText = getSearchText(item);
        if (!normalized) {
            searchText = normalizeText(searchText);
        }
        searchText = ' ' + searchText + ' ';
        var score = 0;
        terms.forEach(function (fragment) {
            var pos = searchText.indexOf(fragment);
            if (pos > 0) {
                var startsWith = pos === 1;
                var wordStart = startsWith || searchText.charAt(pos - 1) === ' ';
                var wholeWord = wordStart && searchText.charAt(pos + fragment.length) === ' ';
                score += (wholeWord && startsWith ? 10000 :
                    wholeWord ? 1000 :
                        startsWith ? 100 :
                            wordStart ? 10 :
                                1);
            }
        });
        if (score > 0) {
            results.push({ item: item, score: score });
        }
    });
    results.sort(function (a, b) { return (a.score < b.score ? 1 :
        a.score > b.score ? -1 :
            0); });
    return results.map(function (result) { return result.item; });
};
textSearch.normalize = normalizeText;

module.exports = textSearch;
