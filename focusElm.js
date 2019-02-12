// place keyboard focus on _elm - setting tabindex="" when needed
// and make sure any window scrolling is both sane and useful
export const getYScroll = function () {
  return window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop;
};

export default function focusElm(_elm, opts) {
  if (_elm) {
    if ( _elm.tabIndex < 0 ) {
      _elm.setAttribute('tabindex', -1);
    }

    // Make note of current scroll position
    var _before = getYScroll();

    // Focus the element!
    _elm.focus();

    // Measure the distance scrolled
    var _scrolld = getYScroll() - _before;

    // Check if the browser jumped to the anchor...
    // (the browser only scrolls the page if the _focusElm was outside the viewport)
    if ( _scrolld ) {
      // But actually, Chrome (as of v.33 at least) will always scroll
      // unless the focused element is wholly within the viewport.
      var elmTop = /*_before + */_scrolld + _elm.getBoundingClientRect().top;
      var orgWinBottom = /*_before + */(window.innerHeight||document.documentElement.clientHeight);
      if ( _scrolld>0  &&  elmTop < orgWinBottom - 50 ) {
        window.scrollTo(window.pageXOffset, _before);
      }
      else {
        // ...then scroll the window to place the anchor at the top of the viewport.
        // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
        var offset = opts && opts.offset;
        var offsetPx = offset && offset.apply ? offset(_elm) : offset || 0;
        var elmTopPos = _elm.getBoundingClientRect().top + getYScroll();
        window.scrollTo( window.pageXOffset,  elmTopPos - offsetPx );
      }
    }
  }
}
