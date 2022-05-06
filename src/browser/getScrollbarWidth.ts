/**
 * Measures the width of scrollbars in the browser
 */
export default function getScrollbarWidth(): number {
	if (!(document && document.body)) {
		return 0;
	}
	const scrollDiv = document.createElement('div');
	scrollDiv.style.cssText =
		'position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll;';
	document.body.appendChild(scrollDiv);
	const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return scrollbarWidth;
}

/**
 * Measures the scrollbar width and sets it as a CSS variable on the `<html/>` element
 */
getScrollbarWidth.setCSSvar = (
	/**
	 * CSS variable name
	 *
	 * Default: `'browser-scrollbar-width'`
	 */
	varName = 'browser-scrollbar-width'
) => {
	document &&
		document.documentElement.style.setProperty(
			'--' + varName,
			getScrollbarWidth() + 'px'
		);
};
