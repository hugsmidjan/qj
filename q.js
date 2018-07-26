'use strict';

//@flow
export default function q(selector/*:string */, root/*::?:Element|null */)/*:Element|null*/ {
  return (!selector || root===null) ? null : (root||document).querySelector(selector);
}
