export type InferTypeFromArray<A> = A extends Array<infer Data> ? Data : never;

export type Nullable<T> = T | null;
export type Maybe<T> = Nullable<T> | undefined;

/** Deep/recursive variant of `Partial` */
export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * A slightly "sounder" variant of `Array` for arrays
 * that will likely be index-accessed, in an unbounded way.
 */
export type SparseArray<V> = Array<V | undefined>;

/**
 * A slightly "sounder" variant of `ReadonlyArray` for arrays
 * that will likely be index-accessed, in an unbounded way.
 */
export type ReadonlySparseArray<V> = ReadonlyArray<V | undefined>;

/**
 * A slightly "sounder" variant of `Record` for objects
 * with unbounded key signature.
 *
 * When values are read from such object, the value
 * may be `undefined`, and the type system should warn about that.
 */
export type SaneRecord<K extends string | number | symbol, V> = string extends K
	? Record<K, V | undefined>
	: number extends K
	? Record<K, V | undefined>
	: symbol extends K
	? Record<K, V | undefined>
	: Record<K, V>;

/**
 * Type predicate function for filtering out falsy values
 *
 * NOTE: The function implementation should probably also
 * filter out `NaN` and other hard-to-type values.
 */
export type ExcludesFalsy = <T>(x: T | null | undefined | false) => x is T;
