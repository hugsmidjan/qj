'use strict';

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map((key) => {
        const param = paramsObj[key];
        return param!=null ? key+'='+encodeURIComponent(''+param) : '';
      })
      .filter((item) => item)
      .join('&');
}

function addUrlParams(url, paramsObj) {
  const hashUrl = url.split('#');
  url = hashUrl[0].replace(/\?$/, '');
  const hash = hashUrl[1] ? '#'+hashUrl[1] : '';
  let queryString = makeQueryString(paramsObj);
  if ( queryString.length ) {
    queryString = (/\?/.test(url) ? '&' : '?') + queryString;
  }
  return url + queryString + hash;
}

module.exports = addUrlParams;
