'use strict';

var _EP = Element.prototype;
var _matcher = _EP.matches || _EP.msMatchesSelector || _EP.webkitMatchesSelector || (function () { return false; });

function matches(selector, elm) {
  return _matcher.call(elm, selector);
}

function closestParent(selector/*:string */, elm/*:Node */, stopper/*::?:Element */) {
  var _stopper = stopper || null;
  while ( elm && !matches(selector, elm) && elm !== _stopper ) {
    elm = elm.parentNode;
  }
  return elm === _stopper ? null : elm;
}

module.exports = closestParent;
