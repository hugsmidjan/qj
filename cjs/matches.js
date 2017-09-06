'use strict';

var _EP = Element.prototype;
var _matcher = _EP.matches || _EP.msMatchesSelector || _EP.webkitMatchesSelector || (function () { return false; });

function matches(selector, elm) {
  return _matcher.call(elm, selector);
}

module.exports = matches;
