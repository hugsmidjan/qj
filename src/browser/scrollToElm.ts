// ScrollTo top of _elm

import getPageScrollElm from '../dom/getPageScrollElm';

export type ScrollToElmOptions<E extends HTMLElement> = {
  offset?: number | ((elm?: E) => number);
  setFocus?: boolean;
  delay?: number;
  // TODO: Add basic animation support
  // speed?: number, // ms for each 100vh - capped at 200vh
  // easing?: EasingFn,
};

export default function scrollToElm<E extends HTMLElement>(
  _elm: E,
  opts: ScrollToElmOptions<E> = {}
): Promise<void> {
  const offsetOpt = opts.offset;
  const offsetFn =
    typeof offsetOpt === 'function'
      ? offsetOpt
      : typeof offsetOpt === 'number'
      ? () => offsetOpt
      : () => 30;

  return new Promise((resolve) => {
    setTimeout(() => {
      if (opts.setFocus) {
        if (_elm.tabIndex < 0) {
          _elm.setAttribute('tabindex', '-1');
        }
        _elm.focus();
      }
      const offset = offsetFn(_elm);

      const scrollElm = getPageScrollElm();

      const targetScrollPos =
        scrollElm.scrollTop + _elm.getBoundingClientRect().top - offset;
      scrollElm.scrollTo(scrollElm.scrollLeft, targetScrollPos);
      resolve();
    }, opts.delay || 0);
  });
}
