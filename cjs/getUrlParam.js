'use strict';

var _paramREs = {};

function getUrlParam(name, url) {
  var re = _paramREs[name];
  if ( !re ) {
    var safeName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    re = new RegExp('(?:^|&)'+safeName+'=([^&]+)');
    _paramREs[name] = re;
  }
  url = url ? url.split('#')[0].split('?')[1] : document.location.search.substr(1);
  return (re.exec(url)||[])[1];
}

module.exports = getUrlParam;
