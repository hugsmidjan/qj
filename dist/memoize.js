//@flow

// Simple, stupid, memory-efficient, and super fast memoizer for **pure functions**.
// Checks for strict equality with the last parameter values.
// Ignores changes in `this` context - like any other side-effect.

var _memoizers = [
    // Hmmm... Why does neither of these work !?!
    // /*::<A,R:*,F:(a:A)=>R>*/(fn/*:F*/)/*:F*/ => {
    // /*::<F:(a:any)=>mixed>*/(fn/*:F*/)/*:F*/ => {
    function (fn) {
        var value, params;
        return function (a) {
            if ( !params || a!==params[0] ) {
                params = [a];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
    function (fn) {
        var value, params;
        return function (a,b) {
            if ( !params || a!==params[0] || b!==params[1] ) {
                params = [a,b];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
    function (fn) {
        var value, params;
        return function (a,b,c) {
            if ( !params || a!==params[0] || b!==params[1] || c!==params[2] ) {
                params = [a,b,c];
                value = fn.apply(this, params);
            }
            return value;
        };
    } ];

var _memoizerN = function (fn, isVariadic) {
    var value;
    var params;
    // return function (...args/*:any[]*/)/*:mixed*/ {
    return function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

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


var memoize = /*::<AnyFn:(...any[]) => mixed>*/function (fn/*:AnyFn*/, isVariadic/*:?boolean*/)/*:AnyFn*/ {
    if ( isVariadic ) {
        //$FlowFixMe
        return _memoizerN(fn, true);
    }
    var memoizer = _memoizers[fn.length - 1] || _memoizerN; // NOTE: Flow doesn't realize that the assignment may fall back to _memoizerN
    //$FlowFixMe
    return memoizer(fn);
};

module.exports = memoize;
