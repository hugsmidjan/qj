declare type ParamsValues = boolean | number | string | null | undefined;
export declare type ParamsObject = Record<string, ParamsValues | Array<ParamsValues>>;
export default function makeQueryString(paramsObj: ParamsObject): string;
export {};
