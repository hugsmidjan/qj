const A = [].slice;

export default function qq(selector/*:string */, root/*::?:Element|null */)/*:Element[] */ {
  return (!selector || root===null) ? [] : A.call((root||document).querySelectorAll(selector));
}
