'use strict';

// Simple, stupid, memory-efficient, and super fast memoizer.
// Checks for strict equality with the last parameter values.
var _memoizers = [
    function (fn) { return fn; },
    function (fn, value, p) {
        return function (a) {
            if ( !p || a!==p[0] ) {
                p = [a];
                value = fn.apply(this, p);
            }
            return value;
        };
    },
    function (fn, value, p) {
        return function (a,b) {
            if ( !p || a!==p[0] || b!==p[1] ) {
                p = [a,b];
                value = fn.apply(this, p);
            }
            return value;
        };
    },
    function (fn, value, p) {
        return function (a,b,c) {
            if ( !p || a!==p[0] || b!==p[1] || c!==p[2] ) {
                p = [a,b,c];
                value = fn.apply(this, p);
            }
            return value;
        };
    } ];
var _memoizerN = function (fn, value, p) {
    var arity = fn.length;
    return function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var dirty = !p;
        if (p) {
            var i = 0;
            while (i < arity) {
                if (args[i] !== p[i]) {
                    dirty = true;
                    break;
                }
                i++;
            }
        }
        if (dirty) {
            p = args;
            value = fn.apply(this, p);
        }
        return value;
    };
};

var memoize = function (fn) {
    var memoizer = _memoizers[fn.length] || _memoizerN;
    return memoizer(fn);
};

module.exports = memoize;
