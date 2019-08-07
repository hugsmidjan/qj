declare type MatcherMethod = (selector: string) => boolean;
interface VendorMatcherMethods {
    msMatchesSelector?: MatcherMethod;
}
declare type _Element = Element & VendorMatcherMethods;
declare function matches<S extends keyof HTMLElementTagNameMap>(selectors: S, elm: _Element): elm is HTMLElementTagNameMap[S];
declare function matches<S extends keyof SVGElementTagNameMap>(selectors: S, elm: _Element): elm is SVGElementTagNameMap[S];
declare function matches(selectors: string, elm: _Element): boolean;
declare function matches<E extends Element>(selectors: string, elm: _Element): elm is E;
export default matches;
