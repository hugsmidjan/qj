//@flow

/*::
    export type HtmlToDivOpts = { [key:string]: boolean };
*/

export default function htmlToDiv(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:HTMLDivElement*/ {
    const doc = (opts||{}).document || document;
    const div = doc.createElement('div');
    div.innerHTML = String(html)
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))( |>)/gi, (m,p1,p2,p3) => {
            return p1 + (opts && opts['keep'+p2.toLowerCase()] ? '' : '--disabled') + p3;
        });
    return div;
}
