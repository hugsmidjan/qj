/**
 * Returns the one of `<html/>` or `<body/>` which seems to be
 * responsible for "scrolling the page". Prefers `<html />`.
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

// ===========================================================================
//
// NOTE: This version which defaults to <body> may be preferrable beacuse of
// how Mobile Browsers interpret the height of <html/> ...
// Needs more research/testing!

/**
 * Returns the one of `<html/>` or `<body/>` which seems to be
 * responsible for "scrolling the page". Prefers `<body />`.
 */
/** /
 const getPageScrollElm = (customWindow: Window = window) => {
	const { document } = customWindow;
	const { body, documentElement } = document;
	// body.insertAdjacentHTML(
	// 	'afterbegin',
	// 	`<pre>${JSON.stringify(
	// 		{
	// 			bodyCH: body.clientHeight,
	// 			bodySH: body.scrollHeight,
	// 			htmlCH: documentElement.clientHeight,
	// 			htmlSH: documentElement.scrollHeight,
	// 		},
	// 		null,
	// 		2
	// 	)}</pre>`
	// );
	if (body.clientHeight !== body.scrollHeight) {
		return body;
	}
	return documentElement;
};

export default getPageScrollElm;
/**/
