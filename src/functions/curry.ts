// Super-simple, minimal, non-recursive function currier
// Complex typings

type Leftovers<A extends Array<any>, C extends Array<any>, F = (...a: A) => void> = [
  never,
  F extends ((a: any, ...z: infer L) => void) ? L : never,
  F extends ((a: any, d: any, ...z: infer L) => void) ? L : never,
  F extends ((a: any, b: any, c: any, ...z: infer L) => void) ? L : never,
  F extends ((a: any, b: any, c: any, d: any, ...z: infer L) => void) ? L : never,
  F extends ((a: any, b: any, c: any, d: any, e: any, ...z: infer L) => void) ? L : never,
][C['length']];

export default function curry<
  O extends Array<any>,
  A extends O[0],
  P extends [A],
  L extends Leftovers<O, P>,
  R,
>(func: (...args: O) => R, ...args: P): (...args: L) => R;
export default function curry<
  O extends Array<any>,
  A extends O[0],
  B extends O[1],
  P extends [A, B],
  L extends Leftovers<O, P>,
  R,
>(func: (...args: O) => R, ...args: P): (...args: L) => R;
export default function curry<
  O extends Array<any>,
  A extends O[0],
  B extends O[1],
  C extends O[2],
  P extends [A, B, C],
  L extends Leftovers<O, P>,
  R,
>(func: (...args: O) => R, ...args: P): (...args: L) => R;
export default function curry<
  O extends Array<any>,
  A extends O[0],
  B extends O[1],
  C extends O[2],
  D extends O[3],
  P extends [A, B, C, D],
  L extends Leftovers<O, P>,
  R,
>(func: (...args: O) => R, ...args: P): (...args: L) => R;
export default function curry<
  O extends Array<any>,
  A extends O[0],
  B extends O[1],
  C extends O[2],
  D extends O[3],
  E extends O[4],
  P extends [A, B, C, D, E],
  L extends Leftovers<O, P>,
  R,
>(func: (...args: O) => R, ...args: P): (...args: L) => R;

export default function curry<R>(func: (...args: any) => R, ...args: any): (...args: any) => R {
  return function (...args2) {
    return func.apply(this, args.concat(args2));
  };
}