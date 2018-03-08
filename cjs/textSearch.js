'use strict';

// Searches for `terms` in the `prop`s of the `items` Array
// Returns a filtered array sorted according by how well the items matched the `term`
var textSearch = function (props) {
  var items = props.items;
  var term = props.term;
  var prop = props.prop;
  var normalized = props.normalized;

  term = term.trim();
  if ( !term ) {
    return items;
  }
  var terms = term.toLowerCase().split(/\s+/);
  var results = [];
  items.forEach(function (item, idx) {
    var searchText =  !prop ?
                          item:
                      prop.apply ?
                          prop(item):
                          item[prop];
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
        score +=  wholeWord && startsWith ? 10000 :
                  wholeWord ? 1000 :
                  startsWith ? 100 :
                  wordStart ? 10 :
                  1;
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
var normalizeText = function (string) { return (
  (string.join ? string.join(' ') : string)
      .replace(/\u00ad/g, '') // remove soft-hyphens
      .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
      .trim()
      .toLowerCase()
); };
textSearch.normalize = normalizeText;

module.exports = textSearch;
