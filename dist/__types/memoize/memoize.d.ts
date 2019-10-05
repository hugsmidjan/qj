declare type AnyFn = (...args: Array<any>) => any;
declare const memoize: <F extends AnyFn>(fn: F, isVariadic?: boolean | undefined) => F;
export default memoize;
