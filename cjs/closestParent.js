'use strict';

var matches = require('./matches.js');

function closestParent(selector/*:string */, elm/*:Node */, stopper/*::?:Element */) {
  let _stopper = stopper || null;
  while ( elm && !matches(selector, elm) && elm !== _stopper ) {
    elm = elm.parentNode;
  }
  return elm === _stopper ? null : elm;
}

module.exports = closestParent;
