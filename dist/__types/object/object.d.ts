export declare type Apply<A extends object, B> = A extends B ? A : B extends object ? ({
    [K in Exclude<keyof A, keyof B>]: A[K];
} & {
    [K in (keyof A & keyof B) | Exclude<keyof B, keyof A>]: B[K];
}) : A;
declare type SameChecker = (valA: any, valB: any, key: string) => boolean;
declare function objectUpdate<O extends object, N extends object>(original: O, newValues: N, customSameCheck?: SameChecker): Apply<O, N>;
declare type FilterFlags<Base, Cond> = {
    [Key in keyof Base]: Cond extends Base[Key] ? Key : never;
};
declare type AllowedNames<Base, Cond> = FilterFlags<Base, Cond>[keyof Base];
declare type Optionaled<T, AndNull, U = AndNull extends true ? undefined | null : undefined> = Omit<T, AllowedNames<T, U>> & Partial<Pick<T, AllowedNames<T, U>>>;
declare const objectClean: <T extends object, N extends boolean = false>(original: T, alsoNull?: N | undefined) => Optionaled<T, N, N extends true ? null | undefined : undefined>;
declare const objectIsEmpty: (object: object) => boolean;
declare function objectIsSame(a: object, b: object, customSameCheck?: SameChecker): boolean;
declare const objectOnly: <T extends object, K extends keyof T>(original: T, keys: K[]) => Pick<T, K>;
declare const objectWithout: <T extends object, K extends keyof T>(original: T, keys: K[]) => Pick<T, Exclude<keyof T, K>>;
declare const objectReplace: (original: object, replacement: object, customSameCheck?: SameChecker | undefined) => object;
export { objectClean, objectIsEmpty, objectIsSame, objectOnly, objectReplace, objectUpdate, objectWithout, };
