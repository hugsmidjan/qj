//@flow

import makeQueryString from './makeQueryString';
/*::
    import type { ParamsObj } from './makeQueryString';
*/

export default function addUrlParams(url/*:string*/, paramsObj/*:ParamsObj*/)/*:string*/ {
    const hashUrl = url.split('#');
    url = hashUrl[0].replace(/\?$/, '');
    const hash = hashUrl[1] ? '#'+hashUrl[1] : '';
    let queryString = makeQueryString(paramsObj);
    if ( queryString.length ) {
        queryString = (/\?/.test(url) ? '&' : '?') + queryString;
    }
    return url + queryString + hash;
}
