import closestParent from '../select/closestParent';

/**
 * Finds and returns the language of an element
 * – traversing up the DOM tree looking for langauge attributes.
 *
 * @param elm Target element - defaults to <html/>
 * @param returnFull `true` returns the full language value – not just the two-character shorthand.
 *
 * Usage:
 * ```js
 * htmlLang(elm);       // returns the language of elm.
 * htmlLang(elm, true); // returns full language code of elm. e.g. "en-uk"
 * htmlLang();          // returns the document language.
 * htmlLang(true);      // returns full document language code. e.g. "en-uk"
 * ```
 */
function htmlLang(returnFull?: boolean): string | undefined;
function htmlLang(elm?: HTMLElement, returnFull?: boolean): string | undefined;

function htmlLang(elm?: HTMLElement | boolean, returnFull?: boolean): string | undefined {
	if (typeof elm === 'boolean') {
		returnFull = elm;
		elm = undefined;
	}
	const lang =
		(elm && elm.lang) ||
		((elm && closestParent<HTMLElement>('[lang]', elm)) || document.documentElement)
			.lang ||
		'';
	return lang ? (!returnFull ? lang.substr(0, 2) : lang).toLowerCase() : undefined;
}

export default htmlLang;
