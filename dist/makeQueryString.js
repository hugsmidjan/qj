//@flow

/*::
    export type ParamsObj = { [key:string]: any };
*/

function makeQueryString(paramsObj/*:ParamsObj*/)/*:string*/ {
    return Object.keys(paramsObj)
        .map(function (key) {
            var param = paramsObj[key];
            return param!=null ? key+'='+encodeURIComponent(String(param)) : '';
        })
        .filter(function (item) { return item; })
        .join('&');
}

module.exports = makeQueryString;
