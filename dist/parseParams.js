//@flow
function parseParams(paramString) {
    var map = {};
    paramString = (paramString != null ? paramString : document.location.search)
        .trim()
        .replace(/^[?&]/, '')
        .replace(/&$/, '');
    if (paramString) {
        paramString
            .replace(/\+/g, ' ')
            .split('&')
            .forEach(function (paramBit) {
            // eslint-disable-next-line prefer-const
            var _a = paramBit.split('='), name = _a[0], value = _a[1];
            name = decodeURIComponent(name);
            var values = map[name] || (map[name] = []);
            values.push(decodeURIComponent(value || ''));
        });
    }
    return map;
}

module.exports = parseParams;
