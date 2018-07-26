'use strict';

var A = require('./A.js');
var htmlToDiv = require('./htmlToDiv.js');

function htmlToNodes(html, opts) {
  return A( htmlToDiv(html, opts).childNodes );
}

module.exports = htmlToNodes;
