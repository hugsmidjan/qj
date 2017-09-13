'use strict';

// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
var debounce = function (func, delay, immediate) {
  var timeout;
  var debouncedFn = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var runNow = immediate && !timeout;
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
};

// Sugar to produce a debounced function
// that accepts its contents/behavior at call time.
// Usage:
//     const myDebouncer = debounce.d(500);
//     myDebouncer(() => { alert('Hello world'); });
//     myDebouncer(() => { alert('I mean: Howdy world!'); });
debounce.d = function (delay, immediate) { return debounce(function (fn) { return fn(); }, delay, immediate); };

module.exports = debounce;
