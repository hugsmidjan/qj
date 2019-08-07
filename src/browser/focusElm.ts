// place keyboard focus on _elm - setting tabindex="" when needed
// and make sure any window scrolling is both sane and useful

export interface FocusElmOpts<T extends HTMLElement = HTMLElement> {
  delay?: number;
  offset?: number | ((elm: T) => number);
}

export const getYScroll = () =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop;

const _focusElm = <E extends HTMLElement>(_elm: E, opts: FocusElmOpts<E>): void => {
  if (_elm.tabIndex < 0) {
    _elm.setAttribute('tabindex', '-1');
  }

  // Make note of current scroll position
  var _before = getYScroll();

  // Focus the element!
  _elm.focus();

  // Measure the distance scrolled
  var _scrolld = getYScroll() - _before;

  // Check if the browser jumped to the anchor...
  // (the browser only scrolls the page if the _focusElm was outside the viewport)
  if (_scrolld) {
    // But actually, Chrome (as of v.33 at least) will always scroll
    // unless the focused element is wholly within the viewport.
    var elmTopFromViewport = _elm.getBoundingClientRect().top;
    var orgWinBottom =
      window.innerHeight || document.documentElement.clientHeight;
    // var elmTop = _before + _scrolld + _elm.getBoundingClientRect().top;
    // var orgWinBottom =
    //   _before + window.innerHeight || document.documentElement.clientHeight;
    if (_scrolld > 0 && _scrolld + elmTopFromViewport < orgWinBottom - 50) {
      window.scrollTo(window.pageXOffset, _before);
    } else {
      // ...then scroll the window to place the anchor at the top of the viewport.
      // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
      var offset = opts.offset;
      var offsetPx = typeof offset === 'function' ? offset(_elm) : offset || 0;
      var elmTopPos = elmTopFromViewport + getYScroll();
      window.scrollTo(window.pageXOffset, elmTopPos - offsetPx);
    }
  }
};

type TimerId = ReturnType<typeof setTimeout>;

export default function focusElm<E extends HTMLElement>(elm: E | null, opts: FocusElmOpts<E>): void | TimerId {
  if (elm) {
    opts = opts || {};
    if (opts.delay == null) {
      _focusElm(elm, opts);
    } else {
      return setTimeout(() => {
        _focusElm(elm, opts);
      }, opts.delay);
    }
  }
}
