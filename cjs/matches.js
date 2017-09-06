'use strict';

var _matcher;
function matches(selector, elm) {
  if ( _matcher == null ) {
    _matcher = elm.matches || elm.msMatchesSelector || elm.webkitMatchesSelector || (function () { return false; });
  }
  return _matcher.call(elm, selector);
}

module.exports = matches;
