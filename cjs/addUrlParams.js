'use strict';

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map(function (key) {
        var param = paramsObj[key];
        return param!=null ? key+'='+encodeURIComponent(''+param) : '';
      })
      .filter(function (item) { return item; })
      .join('&');
}

function addUrlParams(url, paramsObj) {
  var hashUrl = url.split('#');
  url = hashUrl[0].replace(/\?$/, '');
  var hash = hashUrl[1] ? '#'+hashUrl[1] : '';
  var queryString = makeQueryString(paramsObj);
  if ( queryString.length ) {
    queryString = (/\?/.test(url) ? '&' : '?') + queryString;
  }
  return url + queryString + hash;
}

module.exports = addUrlParams;
