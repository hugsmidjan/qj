let _matcher;
export default function matches(selector, elm) {
  if ( _matcher == null ) {
    _matcher = elm.matches || elm.msMatchesSelector || elm.webkitMatchesSelector || (() => false);
  }
  return _matcher.call(elm, selector);
}
