var htmlToDiv = require('./htmlToDiv.js');
var A = require('./A.js');

function htmlToNodes(html, opts) {
    return A(htmlToDiv(html, opts).childNodes);
}

module.exports = htmlToNodes;
