declare function closestParent<S extends keyof HTMLElementTagNameMap>(selectors: S, elm: Node, stopper?: Element | null): HTMLElementTagNameMap[S] | null;
declare function closestParent<S extends keyof SVGElementTagNameMap>(selectors: S, elm: Node, stopper?: Element | null): SVGElementTagNameMap[S] | null;
declare function closestParent<E extends Element>(selectors: string, elm: Node, stopper?: Element | null): E | null;
export default closestParent;
