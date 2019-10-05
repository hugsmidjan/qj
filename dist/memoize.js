// Simple, stupid, memory-efficient, and super fast memoizer for **pure functions**.
// Checks for strict equality with the last parameter values.
// Ignores changes in `this` context - like any other side-effect.
var _memoizers = [
    function (fn) {
        var value;
        var params;
        return function (a) {
            if (!params || a !== params[0]) {
                params = [a];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
    function (fn) {
        var value;
        var params;
        return function (a, b) {
            if (!params || a !== params[0] || b !== params[1]) {
                params = [a, b];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
    function (fn) {
        var value;
        var params;
        return function (a, b, c) {
            if (!params || a !== params[0] || b !== params[1] || c !== params[2]) {
                params = [a, b, c];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
];
var _memoizerN = function (fn, isVariadic) {
    var value;
    var params;
    // return function (...args/*:any[]*/)/*:mixed*/ {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var dirty = !params;
        if (params) {
            var i = 0;
            var n = isVariadic ? Math.max(args.length, params.length) : fn.length;
            while (i < n) {
                if (args[i] !== params[i]) {
                    dirty = true;
                    break;
                }
                i++;
            }
        }
        if (dirty) {
            params = args;
            value = fn.apply(this, params);
        }
        return value;
    };
};
var memoize = function (fn, isVariadic) {
    if (isVariadic) {
        return _memoizerN(fn, true);
    }
    var memoizer = _memoizers[fn.length - 1] || _memoizerN;
    return memoizer(fn);
};

module.exports = memoize;
