/// <reference types="node" />
declare const SECOND = 1000;
declare const MINUTE = 60000;
declare const HOUR = 3600000;
declare const DAY = 86400000;
declare type Callback = () => any;
declare const sinceLast: (timestamp: number, periodSizeMS: number) => number;
declare const untilNext: (timestamp: number, periodSizeMS: number) => number;
declare const atLast: (timestamp: number, periodSizeMS: number) => number;
declare const atNext: (timestamp: number, periodSizeMS: number) => number;
declare const safeTimeout: (callback: Callback, delay: number) => () => NodeJS.Timeout;
declare const onNext: (periodSizeMS: number, offsetMs: number | Callback, callback?: Callback | undefined) => {
    cancel: (execCallback?: boolean | undefined) => void;
} | undefined;
declare const onEvery: (periodSizeMS: number, offsetMs: number | Callback, callback?: Callback | undefined) => {
    cancel: (execCallback?: boolean | undefined) => void;
} | undefined;
export { SECOND, MINUTE, HOUR, DAY, sinceLast, untilNext, atLast, atNext, atLast as atStart, atNext as atEnd, onNext, onEvery, safeTimeout, };
declare const _default: {
    SECOND: number;
    MINUTE: number;
    HOUR: number;
    DAY: number;
    sinceLast: (timestamp: number, periodSizeMS: number) => number;
    untilNext: (timestamp: number, periodSizeMS: number) => number;
    atLast: (timestamp: number, periodSizeMS: number) => number;
    atNext: (timestamp: number, periodSizeMS: number) => number;
    atStart: (timestamp: number, periodSizeMS: number) => number;
    atEnd: (timestamp: number, periodSizeMS: number) => number;
    onNext: (periodSizeMS: number, offsetMs: number | Callback, callback?: Callback | undefined) => {
        cancel: (execCallback?: boolean | undefined) => void;
    } | undefined;
    onEvery: (periodSizeMS: number, offsetMs: number | Callback, callback?: Callback | undefined) => {
        cancel: (execCallback?: boolean | undefined) => void;
    } | undefined;
    safeTimeout: (callback: Callback, delay: number) => () => NodeJS.Timeout;
};
export default _default;
