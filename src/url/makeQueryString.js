//@flow

/*::
    export type ParamsObj = { [key:string]: any };
*/

export default function makeQueryString(paramsObj/*:ParamsObj*/)/*:string*/ {
    return Object.keys(paramsObj)
        .map((key) => {
            const param = paramsObj[key];
            return param!=null ? key+'='+encodeURIComponent(String(param)) : '';
        })
        .filter((item) => item)
        .join('&');
}
