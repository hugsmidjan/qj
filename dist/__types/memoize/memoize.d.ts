declare type AnyFn = (...args: Array<any>) => any;
declare function memoize<F extends AnyFn>(fn: F, isVariadic?: boolean): F;
export default memoize;
