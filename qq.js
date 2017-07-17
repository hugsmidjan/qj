const A = [].slice;

export default function qq(selector/*:string */, root/*::?:Root */)/*:Element[] */ {
  return (!selector || root===null) ? [] : A.call((root||document).querySelectorAll(selector));
}
