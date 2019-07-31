var sortIsl = require('./sortIsl.js');

var supportsIcelandic;
var langAliases = {
    no: 'nb',
};
function alphabetize(arr, lang, getProp) {
    var _getProp = typeof getProp === 'function'
        ? getProp
        : getProp != null
            ? function (item) { return item[getProp] + ''; }
            : function (item) { return item + ''; };
    if (lang !== 'is' || supportsIcelandic ||
        (supportsIcelandic !== false && // This means it's not tested yet
            !!(supportsIcelandic = 'ð'.localeCompare('e', 'is') < 0 && 'ob'.localeCompare('öa', 'is') < 0))) {
        var newArr = arr.map(function (item, idx) { return ({ value: _getProp(item), idx: idx }); });
        lang = langAliases[lang] || lang;
        newArr.sort(function (a, b) {
            return a.value.localeCompare(b.value, lang, {
                sensitivity: 'accent',
                ignorePunctuation: true,
                numeric: true,
            });
        });
        return newArr.map(function (item) { return arr[item.idx]; });
    }
    else {
        return sortIsl(arr, { getProp: _getProp });
    }
}

module.exports = alphabetize;
