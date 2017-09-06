'use strict';

function q(selector/*:string */, root/*::?:Root */)/*:Element|null*/ {
  return (!selector || root===null) ? null : (root||document).querySelector(selector);
}

module.exports = q;
