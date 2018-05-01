//@flow

// Simple, stupid, memory-efficient, and super fast memoizer for **pure functions**.
// Checks for strict equality with the last parameter values.
// Ignores changes in `this` context - like any other side-effect.

/*::
    type AnyFn = (...any[]) => mixed;
*/

const _memoizers = [
    (fn) => fn,
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
const _memoizerN = (fn) => {
    let value, params;
    const arity = fn.length;
    return function (...args) {
        let dirty = !params;
        if (params) {
            let i = 0;
            while (i < arity) {
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

const memoize = (fn/*:AnyFn */)/*: AnyFn */ => {
    const memoizer = _memoizers[fn.length] || _memoizerN;
    return memoizer(fn);
};

export default memoize;
