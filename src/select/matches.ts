type MatcherMethod = (selector: string) => boolean
interface VendorMatcherMethods {
    msMatchesSelector?: MatcherMethod;
}
type _Element = Element & VendorMatcherMethods

let _matcher: MatcherMethod;

function matches<S extends keyof HTMLElementTagNameMap>(selectors: S, elm: _Element): elm is HTMLElementTagNameMap[S];
function matches<S extends keyof SVGElementTagNameMap>(selectors: S, elm: _Element): elm is SVGElementTagNameMap[S];
function matches(selectors: string, elm: _Element): boolean;
function matches<E extends Element>(selectors: string, elm: _Element): elm is E;

function matches(selectors: string, elm: _Element): boolean {
  if ( _matcher == null ) {
    _matcher = elm.matches || (elm.msMatchesSelector) || elm.webkitMatchesSelector || (() => false);
  }
  return _matcher.call(elm, selectors);
}
export default matches;
