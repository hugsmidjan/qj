'use strict';

// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
function debounce(func, delay, immediate) {
  if ( typeof delay === 'boolean' ) {
    immediate = delay;
    delay = 0;
  }
  delay = delay || 50;
  var timeout;
  var debouncedFn = !immediate ?
      // simple delayed function
      function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(_this, args);
        }, delay);
      }:
      // more complex immediately called function
      function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var runNow = !timeout && immediate;
        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          !runNow  &&  func.apply(_this, args); // don't re-invoke `func` if runNow is true
          timeout = 0;
        }, delay);
        runNow  &&  func.apply(_this, args);
      };
  debouncedFn.cancel = function () {
    clearTimeout(timeout);
    timeout = 0;
  };
  return debouncedFn;
}

module.exports = debounce;
