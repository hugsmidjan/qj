var htmlToDiv = require('./htmlToDiv.js');
var A = require('./A.js');

//@flow

/*::
    import type { HtmlToDivOpts } from './htmlToDiv';
*/

function htmlToNodes(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:Array<Node>*/ {
    return A( htmlToDiv(html, opts).childNodes );
}

module.exports = htmlToNodes;
