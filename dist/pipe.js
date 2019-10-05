/**
 * Classic FP pipe function.
 *
 * Accepts a list of single-argument functions
 * and strings them together forming a pipe.
 *
 * Returns a reusable function that feeds
 * its input value through the pipe.
 *
 * ```js
 *     const hof = pipe(fn1, fn2, fn3, ...);
 *     const result = hof(value);
 *     const result2 = hof(value2);
 * ```
 */
var pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (value) {
        return fns.reduce(function (v, fn) { return fn(v); }, value);
    };
};
// ===========================================================
/** /
// Type Testing:

const ret: number = pipe(
  (n: undefined) => n||'Jim',
  (n: string, o?: boolean) => o ? 'hi ' : n,
  (n: string) => n.length,
  (n: number) => Math.ceil(n / 10)
)();
const ret2: number = pipe(
  (n: string) => 'hi ' + n,
  (n: string) => n.length,
  (n: number) => Math.ceil(n / 10)
)('string');
const ret3: unknown = pipe(
  (n: string) => 'hi ' + n,
  (n: string) => n.length,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => n,
  (n: number) => Math.ceil(n / 10)
)('string');

const error2: number = pipe(
  (n: string) => 'hi ' + n,
  (n: string) => n.length,
  (n: number) => Math.ceil(n / 10)
)();
const error: number = pipe(
  (n: string) => 'hi ' + n,
  (n: number) => n * 2,
  (n: number) => Math.ceil(n / 10)
)('string');

console.log(ret, ret2, ret3, error, error2);
/**/

module.exports = pipe;
