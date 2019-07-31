declare type Cancellable<F> = F & {
    cancel(): void;
};
declare const debounce: {
    <F extends (...args: any) => void>(func: F, delay: number, immediate?: boolean | undefined): Cancellable<F>;
    d(delay: number, immediate?: boolean | undefined): Cancellable<(fn: () => void) => void>;
};
export default debounce;
