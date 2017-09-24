'use strict';

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map(function (key) {
        var param = paramsObj[key];
        return (param!=null ? key+'='+encodeURIComponent(''+param) : '');
      })
      .join('&');
}

function addUrlParams(url, paramsObj) {
  var hashUrl = url.split('#');
  url = hashUrl[0].replace(/\?$/, '');
  var hash = hashUrl[1] ? '#'+hashUrl[1] : '';
  var delim = /\?/.test(url) ? '&' : '?';
  var queryString = makeQueryString(paramsObj);
  return url + (queryString.length ? delim : '') + queryString + hash;
}

module.exports = addUrlParams;
