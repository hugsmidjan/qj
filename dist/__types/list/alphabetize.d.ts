declare type ToStringer<T> = (item: T) => string;
declare function alphabetize<T extends object, K extends keyof T>(arr: Array<T>, lang: string, getProp?: K): Array<T>;
declare function alphabetize<T extends object | string | number>(arr: Array<T>, lang: string, options?: ToStringer<T>): Array<T>;
export default alphabetize;
