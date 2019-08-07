// Simple, stupid, memory-efficient, and super fast memoizer for **pure functions**.
// Checks for strict equality with the last parameter values.
// Ignores changes in `this` context - like any other side-effect.

type AnyFn = (...args: Array<any>) => any
type AnyFn1 = (...args: [any]) => any
type AnyFn2 = (...args: [any, any]) => any
type AnyFn3 = (...args: [any, any, any]) => any

const _memoizers: Array<<F extends AnyFn>(fn: F) => F> = [
    <F extends AnyFn1>(fn: F) => {
        let value: ReturnType<F>; let params: Parameters<F>;
        return function (a) {
            if ( !params || a!==params[0] ) {
                params = [a] as Parameters<F>;
                value = fn.apply(this, params);
            }
            return value;
        } as F;
    },
    <F extends AnyFn2>(fn: F) => {
        let value: ReturnType<F>; let params: Parameters<F>;
        return function (a,b) {
            if ( !params || a!==params[0] || b!==params[1] ) {
                params = [a,b] as Parameters<F>;
                value = fn.apply(this, params);
            }
            return value;
        } as F;
    },
    <F extends AnyFn3>(fn: F) => {
        let value: ReturnType<F>; let params: Parameters<F>;
        return function (a,b,c) {
          if ( !params || a!==params[0] || b!==params[1] || c!==params[2] ) {
              params = [a,b,c] as Parameters<F>;
              value = fn.apply(this, params);
          }
          return value;
      } as F;
    },
];

const _memoizerN = <F extends AnyFn>(fn: F, isVariadic?: boolean): F => {
    type P = Parameters<F>
    let value: ReturnType<F>; let params: P;
    // return function (...args/*:any[]*/)/*:mixed*/ {
    return function (...args: P) {
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
    } as F;
};


const memoize = <F extends AnyFn>(fn: F, isVariadic?: boolean): F => {
    if ( isVariadic ) {
        return _memoizerN(fn, true);
    }
    const memoizer = _memoizers[fn.length - 1] || _memoizerN;
    return memoizer(fn);
};

export default memoize;
