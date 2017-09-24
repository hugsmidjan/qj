'use strict';

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map(function (key) {
        var param = paramsObj[key];
        return (param!=null ? key+'='+encodeURIComponent(''+param) : '');
      })
      .join('&');
}

module.exports = makeQueryString;
