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
function aquireId(el, prefDefaultId) {
    if (typeof el === 'string') {
        prefDefaultId = el;
        el = undefined;
    }
    if (el) {
        el = 'nodeType' in el ? el : el[0];
    }
    if (!el || !el.id) {
        var id = prefDefaultId || _guidPrefix + _guid++;
        if (prefDefaultId) {
            var count = void 0;
            var idPrefix = prefDefaultId;
            while (document.getElementById(id)) {
                if (count === undefined) {
                    var m = prefDefaultId.match(/\d+$/);
                    count = m ? parseInt(m[0]) : 1;
                    idPrefix = m ? prefDefaultId.replace(/\d+$/, '') : prefDefaultId;
                }
                count++;
                id = idPrefix + count;
            }
        }
        if (!el) {
            return id;
        }
        if (!el.id) {
            el.id = id;
        }
    }
    return el.id;
}

module.exports = aquireId;
