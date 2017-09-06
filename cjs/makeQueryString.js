'use strict';

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map(function (key) {
        var param = paramsObj[key];
        return key +'='+ (param!=null ? encodeURIComponent(param) : '');
      })
      .join('&');
}

module.exports = makeQueryString;
