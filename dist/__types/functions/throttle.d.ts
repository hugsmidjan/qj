declare type Finishable<F> = F & {
    finish(): void;
};
declare const throttle: <A extends any[], F extends (...args: A) => void>(func: F, delay: number, skipFirst?: boolean | undefined) => Finishable<F>;
export default throttle;
