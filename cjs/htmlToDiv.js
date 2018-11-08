//@flow

/*::
    export type HtmlToDivOpts = { [key:string]: boolean };
*/

function htmlToDiv(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:HTMLDivElement*/ {
    var div = document.createElement('div');
    div.innerHTML = String(html)
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))/gi, function (m,p1,p2) {
            return p1 + (opts && !opts['keep'+p2.toLowerCase()] ? '' : '--disabled');
        });
    return div;
}

module.exports = htmlToDiv;
