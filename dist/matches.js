var _matcher;
function matches(selectors, elm) {
    if (_matcher == null) {
        _matcher = elm.matches || (elm.msMatchesSelector) || elm.webkitMatchesSelector || (function () { return false; });
    }
    return _matcher.call(elm, selectors);
}

module.exports = matches;
