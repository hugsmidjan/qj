declare type Fn<I, O> = (value: I) => O;
declare type FnOpt<I, O> = (value?: I) => O;
declare type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
declare type IfUndef<T, Y, N> = Extract<T, undefined> extends never ? N : Y;
declare type FnX<I, O> = IfAny<I, FnOpt<I, O>, IfUndef<I, FnOpt<I, O>, Fn<I, O>>>;
interface Piper {
    <D, R>(fn1: Fn<D, R>): FnX<D, R>;
    <D, D2, R>(fn1: Fn<D, D2>, fn2: Fn<D2, R>): FnX<D, R>;
    <D, D2, D3, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, R>): FnX<D, R>;
    <D, D2, D3, D4, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, R>): FnX<D, R>;
    <D, D2, D3, D4, D5, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, R>): FnX<D, R>;
    <D, D2, D3, D4, D5, D6, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, R>): FnX<D, R>;
    <D, D2, D3, D4, D5, D6, D7, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, R>): FnX<D, R>;
    <D, D2, D3, D4, D5, D6, D7, D8, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, D8>, fn8: Fn<D8, R>): FnX<D, R>;
    <D, D2, D3, D4, D5, D6, D7, D8, D9, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, D8>, fn8: Fn<D8, D9>, fn9: Fn<D9, R>): FnX<D, R>;
    <D, D2, D3, D4, D5, D6, D7, D8, D9>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, D8>, fn8: Fn<D8, D9>, fn9: Fn<D9, any>, ...fns: Array<Fn<any, any>>): FnX<D, unknown>;
}
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
declare const pipe: Piper;
export default pipe;
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
