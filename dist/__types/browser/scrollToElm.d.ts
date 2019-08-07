export interface ScrollToElmOptions<E extends HTMLElement> {
    offset?: number | ((elm?: E) => number);
    setFocus?: boolean;
    delay?: number;
}
export default function scrollToElm<E extends HTMLElement>(_elm: E, opts?: ScrollToElmOptions<E>): Promise<void>;
