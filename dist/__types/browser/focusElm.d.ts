export interface FocusElmOpts<T extends HTMLElement = HTMLElement> {
    delay?: number;
    offset?: number | ((elm: T) => number);
}
export declare const getYScroll: () => number;
declare type TimerId = ReturnType<typeof setTimeout>;
export default function focusElm<E extends HTMLElement>(elm: E | null, opts: FocusElmOpts<E>): void | TimerId;
export {};
