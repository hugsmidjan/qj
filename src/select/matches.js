//@flow
/*::
    type MatcherMethod = (selector:string) => boolean
    type VendorMatcherMethods = {
        msMatchesSelector?: MatcherMethod,
        webkitMatchesSelector?: MatcherMethod,
    }
*/
let _matcher;
export default function matches(selector/*:string*/, elm/*:Element & VendorMatcherMethods*/)/*:boolean*/ {
  if ( _matcher == null ) {
    _matcher = elm.matches || (elm.msMatchesSelector) || elm.webkitMatchesSelector || (() => false);
  }
  return _matcher.call(elm, selector);
}