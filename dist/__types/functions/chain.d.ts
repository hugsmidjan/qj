declare type Fn<I, O> = (value: I) => O;
interface Chainer<D> {
    <R>(fn1: Fn<D, R>): R;
    <D2, R>(fn1: Fn<D, D2>, fn2: Fn<D2, R>): R;
    <D2, D3, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, R>): R;
    <D2, D3, D4, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, R>): R;
    <D2, D3, D4, D5, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, R>): R;
    <D2, D3, D4, D5, D6, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, R>): R;
    <D2, D3, D4, D5, D6, D7, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, R>): R;
    <D2, D3, D4, D5, D6, D7, D8, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, D8>, fn8: Fn<D8, R>): R;
    <D2, D3, D4, D5, D6, D7, D8, D9, R>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, D8>, fn8: Fn<D8, D9>, fn9: Fn<D9, R>): R;
    <D2, D3, D4, D5, D6, D7, D8, D9>(fn1: Fn<D, D2>, fn2: Fn<D2, D3>, fn3: Fn<D3, D4>, fn4: Fn<D4, D5>, fn5: Fn<D5, D6>, fn6: Fn<D6, D7>, fn7: Fn<D7, D8>, fn8: Fn<D8, D9>, fn9: Fn<D9, any>, ...fns: Array<Fn<any, any>>): unknown;
}
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
declare const chain: <D>(value?: D | undefined) => Chainer<D>;
export default chain;
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
