// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
var debounce = function (func, delay, immediate) {
    var timeout;
    var debouncedFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var runNow = immediate && !timeout;
        var _this = this;
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function () {
            !runNow && func.apply(_this, args); // don't re-invoke `func` if runNow is true
            timeout = undefined;
        }, delay);
        runNow && func.apply(_this, args);
    };
    debouncedFn.cancel = function () {
        timeout && clearTimeout(timeout);
        timeout = undefined;
    };
    return debouncedFn;
};
clearTimeout(setTimeout(function () { }, 1000));
// Sugar to produce a dynamic debounced function
// that accepts its contents/behavior at call time.
// Usage:
//     const myDebouncer = debounce.d(500);
//     myDebouncer(() => { alert('Hello world'); });
//     myDebouncer(() => { alert('I mean: Howdy world!'); });
debounce.d = function (delay, immediate) { return debounce(function (fn) { return fn(); }, delay, immediate); };

module.exports = debounce;
