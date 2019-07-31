declare type ToStringer<T> = (item: T) => string;
declare type Grouped<T> = Record<string, Array<T>>;
declare function groupArrayBy<T extends object, K extends keyof T>(list: ArrayLike<T>, prop: K): Grouped<T>;
declare namespace groupArrayBy {
    var asArray: {
        <T extends object, K extends keyof T>(list: ArrayLike<T>, prop: K): {
            name: string;
            items: T[];
        }[];
        <T extends string | number | object>(list: ArrayLike<T>, prop: ToStringer<T>): {
            name: string;
            items: T[];
        }[];
    };
}
declare function groupArrayBy<T extends object | string | number>(list: ArrayLike<T>, prop: ToStringer<T>): Grouped<T>;
declare namespace groupArrayBy {
    var asArray: {
        <T extends object, K extends keyof T>(list: ArrayLike<T>, prop: K): {
            name: string;
            items: T[];
        }[];
        <T extends string | number | object>(list: ArrayLike<T>, prop: ToStringer<T>): {
            name: string;
            items: T[];
        }[];
    };
}
export default groupArrayBy;
