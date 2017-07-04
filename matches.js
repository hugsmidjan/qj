const _EP = Element.prototype;
const _matcher = _EP.matches || _EP.msMatchesSelector || _EP.webkitMatchesSelector || (() => false);

export default function matches(selector, elm) {
  return _matcher.call(elm, selector);
}
