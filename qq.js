const A = [].slice;

export default function Q(selector/*:string */, root/*::?:Root */)/*:Element[] */ {
  return (!selector || root===null) ? [] : A.call((root||document).querySelectorAll(selector));
}
