'use strict';

//@flow
/*
::  // FIXME: Better describe qq() to reflect actual return Array...

    type ElementListSelector = <S:string, R:Element|Document>
        (selector:S, null) => null
        & (selector:S) => null | $Call<document.querySelectorAll,S>
        & (selector:S, root:R => null | $Call<$Value<R,'querySelectorAll'>,S>
*/
function q(selector/*:string */, root/*::?:HTMLElement|null */)/*:HTMLElement|null*/ {
  return (!selector || root===null) ? null : (root||document).querySelector(selector);
}

module.exports = q;
