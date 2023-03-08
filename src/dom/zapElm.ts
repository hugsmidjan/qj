export default function zapElm(elm: Element) {
  const parent = elm.parentNode;
  if (parent) {
    while (elm.firstChild) {
      parent.insertBefore(elm.firstChild, elm);
    }
    parent.removeChild(elm);
  }
}
