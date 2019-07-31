function htmlToDiv(html, opts) {
    var doc = (opts || {}).document || document;
    var div = doc.createElement('div');
    div.innerHTML = String(html)
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))( |>)/gi, function (m, p1, p2, p3) {
        return (p1 +
            (opts &&
                // @ts-ignore  (slighly hacky single-pass rather than mulitple enumerating passes)
                opts['keep' + p2.toLowerCase()]
                ? ''
                : '--disabled') +
            p3);
    });
    return div;
}

module.exports = htmlToDiv;
