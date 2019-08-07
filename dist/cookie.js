Object.defineProperty(exports, '__esModule', { value: true });

var getCookie = function (name) {
    var nameEquals = name + '=';
    var nameLength = nameEquals.length;
    var cookies = document.cookie ? document.cookie.split(/\s*;\s*/) : [];
    for (var i = 0; i < cookies.length; i++) {
        var cookie_1 = cookies[i];
        if (cookie_1.substr(0, nameLength) === nameEquals) {
            return decodeURIComponent(cookie_1.substr(nameLength));
        }
    }
};
function setCookie(name, value, options) {
    options = options || {};
    var expires = (value == null) ? -1 : options.expires;
    if (typeof expires === 'number') {
        expires = new Date(Date.now() + (expires * 24 * 60 * 60 * 1000));
    }
    value = (value == null) ? '' : value;
    document.cookie = (name + '=' + encodeURIComponent(value) +
        (expires ? '; expires=' + expires.toUTCString() : '') +
        (options.path ? '; path=' + options.path : '') +
        (options.domain ? '; domain=' + options.domain : '') +
        (options.secure ? '; secure' : ''));
}
var cookie = {
    get: getCookie,
    set: setCookie,
};

exports.default = cookie;
exports.getCookie = getCookie;
exports.setCookie = setCookie;
