// place keyboard focus on _elm - setting tabindex="" when needed
// and make sure any window scrolling is both sane and useful

import getPageScrollElm from '../dom/getPageScrollElm';

export type FocusElmOpts<T extends HTMLElement = HTMLElement> = {
	delay?: number;
	offset?: number | ((elm: T) => number);
};

export const getYScroll = () =>
	document.documentElement.scrollTop || document.body.scrollTop;

const _focusElm = <E extends HTMLElement>(_elm: E, opts: FocusElmOpts<E>): void => {
	if (_elm.tabIndex < 0) {
		_elm.setAttribute('tabindex', '-1');
	}

	const scrollElm = getPageScrollElm();

	// Make note of current scroll position
	const _before = scrollElm.scrollTop;

	// Focus the element!
	_elm.focus();

	// Measure the distance scrolled
	const _scrolld = scrollElm.scrollTop - _before;

	// Check if the browser jumped to the anchor...
	// (the browser only scrolls the page if the _focusElm was outside the viewport)
	if (_scrolld) {
		// But actually, Chrome (as of v.33 at least) will always scroll
		// unless the focused element is wholly within the viewport.
		const elmTopFromViewport = _elm.getBoundingClientRect().top;
		const orgWinBottom = scrollElm.clientHeight;

		if (_scrolld > 0 && _scrolld + elmTopFromViewport < orgWinBottom - 50) {
			scrollElm.scrollTo(scrollElm.scrollLeft, _before);
		} else {
			// ...then scroll the scrollElm to place the anchor at the top of the viewport.
			// (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
			const offset = opts.offset;
			const offsetPx = typeof offset === 'function' ? offset(_elm) : offset || 0;
			const elmTopPos = elmTopFromViewport + getYScroll();
			scrollElm.scrollTo(scrollElm.scrollLeft, elmTopPos - offsetPx);
		}
	}
};

type TimerId = ReturnType<typeof setTimeout>;

export default function focusElm<E extends HTMLElement>(
	elm: E | null | undefined,
	options?: FocusElmOpts<E>
): void | TimerId {
	if (elm) {
		const opts = options || {};
		if (opts.delay == null) {
			_focusElm(elm, opts);
		} else {
			return setTimeout(() => {
				_focusElm(elm, opts);
			}, opts.delay);
		}
	}
}
