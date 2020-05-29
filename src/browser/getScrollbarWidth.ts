const doc = document;

/**
 * Measures the width of scrollbars in the browser
 */
export default function getScrollbarWidth(): number {
	if (!(doc && doc.body)) {
		return 0;
	}
	const scrollDiv = doc.createElement('div');
	scrollDiv.style.cssText =
		'position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll;';
	doc.body.appendChild(scrollDiv);
	const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	doc.body.removeChild(scrollDiv);
	return scrollbarWidth;
}

/**
 * Measures the scrollbar width and sets it as a CSS variable on the `<html/>` element
 */
getScrollbarWidth.setCSSvar = (varName = 'browser-scrollbar-width') => {
	doc &&
		doc.documentElement.style.setProperty('--' + varName, getScrollbarWidth() + 'px');
};
