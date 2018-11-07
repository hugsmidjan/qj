//@flow

/*::
    export type HtmlToDivOpts = { [key:string]: boolean };
*/

export default function htmlToDiv(html/*:string*/, opts/*:?HtmlToDivOpts*/)/*:HTMLDivElement*/ {
    const div = document.createElement('div');
    div.innerHTML = String(html)
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))/gi, (m,p1,p2) => {
            return p1 + (opts && !opts['keep'+p2.toLowerCase()] ? '' : '--disabled');
        });
    return div;
}
