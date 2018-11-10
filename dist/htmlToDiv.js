//@flow

/*::
    export type HtmlToDivOpts = {
        keepimg?: boolean,
        keepscript?: boolean,
        keephtml?: boolean,
        keepbody?: boolean,
        keeptitle?: boolean,
        keepmeta?: boolean,
        keepstyle?: boolean,
        keeplink?: boolean,

        document?: HTMLDocument,
    };
*/

function htmlToDiv(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:HTMLDivElement*/ {
    var doc = (opts||{}).document || document;
    var div = doc.createElement('div');
    div.innerHTML = String(html)
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))( |>)/gi, function (m,p1,p2,p3) {
            return p1 + (opts && opts['keep'+p2.toLowerCase()] ? '' : '--disabled') + p3;
        });
    return div;
}

module.exports = htmlToDiv;
