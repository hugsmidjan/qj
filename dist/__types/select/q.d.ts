declare function q<S extends keyof HTMLElementTagNameMap>(selectors: S, root?: Element | null): HTMLElementTagNameMap[S] | null;
declare function q<S extends keyof SVGElementTagNameMap>(selectors: S, root?: Element | null): SVGElementTagNameMap[S] | null;
declare function q<E extends Element = Element>(selectors: string, root?: Element | null): E | null;
export default q;
