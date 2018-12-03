'use strict';

//@flow
/*::
    type MatcherMethod = (selector:string) => boolean
    type VendorMatcherMethods = {
        msMatchesSelector?: MatcherMethod,
        webkitMatchesSelector?: MatcherMethod,
    }
*/
var _matcher;
function matches(selector/*:string*/, elm/*:Element & VendorMatcherMethods*/)/*:boolean*/ {
  if ( _matcher == null ) {
    _matcher = elm.matches || (elm.msMatchesSelector) || elm.webkitMatchesSelector || (function () { return false; });
  }
  return _matcher.call(elm, selector);
}

module.exports = matches;
