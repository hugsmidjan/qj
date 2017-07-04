const domid_prefix = '_' + /*@__PURE__*/(Date.now()+'-').substr(6);
let domid_incr = 0;

export default function domid()/*: string */ {
  return domid_prefix + (domid_incr++);
}
