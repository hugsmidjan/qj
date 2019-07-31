function makeQueryString(paramsObj) {
    return Object.keys(paramsObj)
        .reduce(function (acc, key) {
        var param = paramsObj[key];
        if (!Array.isArray(param)) {
            param = [param];
        }
        param.forEach(function (value) {
            if (param != null) {
                acc.push(key + '=' + encodeURIComponent(String(value)));
            }
        });
        return acc;
    }, [])
        .join('&');
}

module.exports = makeQueryString;
