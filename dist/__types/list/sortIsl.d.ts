declare type ToStringer<T> = (item: T) => string;
declare type Sorter = (a: string, b: string) => -1 | 1 | 0;
export declare type SortIslOptions<T extends object | string | number> = {
    reverse?: boolean;
    sortFn?: Sorter;
    getProp?: ToStringer<T>;
};
declare function sortIsl<T extends object, K extends keyof T>(arr: Array<T>, options?: K): Array<T>;
declare function sortIsl<T extends object | string | number>(arr: Array<T>, options?: ToStringer<T>): Array<T>;
declare function sortIsl<T extends object | string | number>(arr: Array<T>, options?: SortIslOptions<T>): Array<T>;
export default sortIsl;
