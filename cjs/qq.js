'use strict';

//@flow
var A = [].slice;
/*
::  // FIXME: Better describe qq() to reflect actual return Array...
    type ElementListSelector = <S:string, R:Element|Document>
        (selector:S, null) => []
        & (selector:S) => Array<$Call<document.querySelectorAll,S>>
        & (selector:S, root:R => Array<$Call<$Value<R,'querySelectorAll'>,S>>
*/

function qq(selector/*:string*/, root/*::?:HTMLElement|null*/)/*:HTMLElement[]*/ {
  return (!selector || root===null) ? [] : A.call((root||document).querySelectorAll(selector));
}

module.exports = qq;
