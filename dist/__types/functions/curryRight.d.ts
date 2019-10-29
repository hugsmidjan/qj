import { Leftovers } from './_types.privates';
export default function curryRight<O extends Array<any>, A extends O[0], P extends [A], L extends Leftovers<O, P>, R>(func: (...args: O) => R, ...args: L): (...args: P) => R;
export default function curryRight<O extends Array<any>, A extends O[0], B extends O[1], P extends [A, B], L extends Leftovers<O, P>, R>(func: (...args: O) => R, ...args: L): (...args: P) => R;
export default function curryRight<O extends Array<any>, A extends O[0], B extends O[1], C extends O[2], P extends [A, B, C], L extends Leftovers<O, P>, R>(func: (...args: O) => R, ...args: L): (...args: P) => R;
export default function curryRight<O extends Array<any>, A extends O[0], B extends O[1], C extends O[2], D extends O[3], P extends [A, B, C, D], L extends Leftovers<O, P>, R>(func: (...args: O) => R, ...args: L): (...args: P) => R;
export default function curryRight<O extends Array<any>, A extends O[0], B extends O[1], C extends O[2], D extends O[3], E extends O[4], P extends [A, B, C, D, E], L extends Leftovers<O, P>, R>(func: (...args: O) => R, ...args: L): (...args: P) => R;
