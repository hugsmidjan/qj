var splitUrl = function (url) {
    var _a = url.split('#'), urlAndQuery = _a[0], _hash = _a[1];
    var _b = urlAndQuery.split('?'), _url = _b[0], _query = _b[1];
    return {
        url: _url || '',
        queryString: _query || '',
        hash: _hash || '',
    };
};

module.exports = splitUrl;
