declare function qq<S extends keyof HTMLElementTagNameMap>(selectors: S, root?: Element | null): Array<HTMLElementTagNameMap[S]>;
declare function qq<S extends keyof SVGElementTagNameMap>(selectors: S, root?: Element | null): Array<SVGElementTagNameMap[S]>;
declare function qq<E extends Element = Element>(selectors: string, root?: Element | null): Array<E>;
export default qq;
