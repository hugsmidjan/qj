/**
 * Returns the one of `<html/>` or `<body/>` which seems to be
 * responsible for "scrolling the page", preferring `<html />`.
 */
const getPageScrollElm = (customWindow: Window = window) => {
	const document = customWindow.document;
	const bodyElm = document.body;
	let pageScrollElm = document.documentElement;
	if (
		pageScrollElm.clientHeight === pageScrollElm.scrollHeight &&
		bodyElm.clientHeight !== bodyElm.scrollHeight
	) {
		pageScrollElm = bodyElm;
	}
	return pageScrollElm;
};

export default getPageScrollElm;
