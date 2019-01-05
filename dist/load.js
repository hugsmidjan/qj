require('./makeQueryString.js');
var addUrlParams = require('./addUrlParams.js');

// Minimal, promise-returning ajax HTTP GET function.
// No bells, whistles, kitchen-plumbing, options, etc.
// Use fetch (w. polyfill) if you need more power).

function load(url, params/*, opts*/) {
  if ( params ) {
    url = addUrlParams(url, params);
  }
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        resolve(request.responseText);
      }
      else {
        reject();
      }
    };
    request.onerror = function () {
      reject();
    };
    request.send();
  });
}

module.exports = load;
