//@flow

// Simple, stupid, memory-efficient, and super fast memoizer for **pure functions**.
// Checks for strict equality with the last parameter values.
// Ignores changes in `this` context - like any other side-effect.

const _memoizers = [
    (fn) => {
        let value, params;
        return function (a) {
            if ( !params || a!==params[0] ) {
                params = [a];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
    (fn) => {
        let value, params;
        return function (a,b) {
            if ( !params || a!==params[0] || b!==params[1] ) {
                params = [a,b];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
    (fn) => {
        let value, params;
        return function (a,b,c) {
            if ( !params || a!==params[0] || b!==params[1] || c!==params[2] ) {
                params = [a,b,c];
                value = fn.apply(this, params);
            }
            return value;
        };
    },
];

const _memoizerN = (fn, isVariadic) => {
    let value;
    let params;
    // return function (...args/*:any[]*/)/*:mixed*/ {
    return function (...args) {
        let dirty = !params;
        if (params) {
            let i = 0;
            const n = isVariadic ? Math.max(args.length, params.length) : fn.length;
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


const memoize = /*::<AnyFn:(...any[]) => mixed>*/(fn/*:AnyFn*/, isVariadic/*:?boolean*/)/*:AnyFn*/ => {
    if ( isVariadic ) {
        //$FlowFixMe
        return _memoizerN(fn, true);
    }
    const memoizer = _memoizers[fn.length - 1] || _memoizerN; // NOTE: Flow doesn't realize that the assignment may fall back to _memoizerN
    //$FlowFixMe
    return memoizer(fn);
};

export default memoize;
