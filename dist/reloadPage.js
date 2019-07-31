function reloadPage(url) {
    var _docLoc = document.location;
    var _docHref = _docLoc.href;
    url = url || _docHref;
    // juggling ?/& suffixes is neccessary to 100% guarantee a reload.
    if (url === _docHref) {
        var blah = !/\?/.test(url) ?
            '?' :
            !/[&?](?:#|$)/.test(url) ?
                '&' :
                '';
        url = url.replace(/[&?]?(#.*)?$/, blah + '$1');
    }
    _docLoc.replace(url);
}

module.exports = reloadPage;
