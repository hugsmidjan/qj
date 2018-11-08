// Usage:
//   aquireId();                         // returns a valid unique DOM id string that can be safely assigned to an element.
//   aquireId(prefDefaultIdString);      // returns a valid unique DOM id based on `prefDefaultIdString` (appending/autoincrementing a trailing integer if needed)
//   aquireId(elm);                      // returns the value of elm.id -- automatically assigning a unique id first, if needed.
//   aquireId(elm, prefDefaultIdString); // returns the value of elm.id -- if needed automatically assigning a unique id based on `prefDefaultIdString`.
//

// suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
var _guidPrefix = 'tmp_' + Date.now() + '_';
// a counter that should be incremented with each use.
var _guid = 1;

// aquireId
function aquireId(el, prefDefaultId) { // el is an optional parameter.
  if (typeof el === 'string') {
    prefDefaultId = el;
    el = undefined;
  }
  if ( el ) {
    el = el.nodeType ? el : el[0];
  }
  if (!el || !el.id) {
    var id = prefDefaultId  ||  _guidPrefix + _guid++;
    if (prefDefaultId) {
      var count;
      while ( document.getElementById(id) ) {
        if (count === undefined) {
          var m = prefDefaultId.match(/\d+$/);
          count = m ? parseInt(m[0],10) : 1;
          prefDefaultId = m ? prefDefaultId.replace(/\d+$/, '') : prefDefaultId;
        }
        count++;
        id = prefDefaultId + count;
      }
    }
    if (!el) { return id; }
    if (!el.id) { el.id = id; }
  }
  return el.id;
}

module.exports = aquireId;
