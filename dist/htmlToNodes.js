var A = require('./A.js');
var htmlToDiv = require('./htmlToDiv.js');

//@flow

/*::
    import type { HtmlToDivOpts } from './htmlToDiv';
*/

function htmlToNodes(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:Array<Node>*/ {
    return A( htmlToDiv(html, opts).childNodes );
}

module.exports = htmlToNodes;
