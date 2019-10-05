/**
 * A value-first syntatic twist on the classic FP pipe pattern.
 *
 * Accepts a single initial value and returns a function that accepts a
 * list of single-argument functions and instantly pipes the initial
 * value through them.
 *
 * ```js
 *     const result = chain(value)(
 *        fn1,
 *        fn2,
 *        fn3,
 *        ...
 *     );
 * ```
 */
var chain = function (value) { return function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return fns.reduce(function (v, fn) { return fn(v); }, value);
}; };
// ===========================================================
/** /
// Type Testing:

const ret: number = chain()(
  () => 'Jim',
  (n?: string) => 'hi ' + n,
  (n: string) => n.length,
  (n: number) => Math.ceil(n / 10)
);
const ret2: unknown = chain('string')(
  (n?: string) => 'hi ' + n,
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
);
const retE = chain('string')(
  (n: string) => 'hi ' + n,
  (n: number) => n * 2,
  (n: number) => Math.ceil(n / 10)
);

console.log(ret, ret2, retE);
/**/

module.exports = chain;
