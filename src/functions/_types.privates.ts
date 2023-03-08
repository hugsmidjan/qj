export type Leftovers<
  A extends Array<any>,
  C extends Array<any>,
  F = (...a: A) => void
> = [
  never,
  F extends (a: any, ...z: infer L) => void ? L : never,
  F extends (a: any, d: any, ...z: infer L) => void ? L : never,
  F extends (a: any, b: any, c: any, ...z: infer L) => void ? L : never,
  F extends (a: any, b: any, c: any, d: any, ...z: infer L) => void ? L : never,
  F extends (a: any, b: any, c: any, d: any, e: any, ...z: infer L) => void ? L : never
][C['length']];
