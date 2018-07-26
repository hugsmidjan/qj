'use strict';

//@flow
function q(selector/*:string */, root/*::?:Element|null */)/*:Element|null*/ {
  return (!selector || root===null) ? null : (root||document).querySelector(selector);
}

module.exports = q;
