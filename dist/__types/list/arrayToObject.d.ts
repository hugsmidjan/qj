declare type ItemCount<T extends string | number> = Record<T, number>;
declare type ByProp<T> = Record<string, T>;
declare function arrayToObject<T extends object, K extends keyof T>(list: ArrayLike<T>, prop: K): ByProp<T>;
declare function arrayToObject<T extends string | number>(list: ArrayLike<T>): ItemCount<T>;
export default arrayToObject;
