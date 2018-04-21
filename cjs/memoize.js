'use strict';

// Simple, stupid, memory-efficient, and super fast memoizer.
// Checks for strict equality with the last parameter values.
const _memoizers = [
    (fn) => fn,
    (fn, value, p) => {
        return function (a) {
            if ( !p || a!==p[0] ) {
                p = [a];
                value = fn.apply(this, p);
            }
            return value;
        };
    },
    (fn, value, p) => {
        return function (a,b) {
            if ( !p || a!==p[0] || b!==p[1] ) {
                p = [a,b];
                value = fn.apply(this, p);
            }
            return value;
        };
    },
    (fn, value, p) => {
        return function (a,b,c) {
            if ( !p || a!==p[0] || b!==p[1] || c!==p[2] ) {
                p = [a,b,c];
                value = fn.apply(this, p);
            }
            return value;
        };
    },
];
const _memoizerN = (fn, value, p) => {
    const arity = fn.length;
    return function (...args) {
        let dirty = !p;
        if (p) {
            let i = 0;
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

const memoize = (fn) => {
    const memoizer = _memoizers[fn.length] || _memoizerN;
    return memoizer(fn);
};

module.exports = memoize;
