const getPageScrollElm = () => {
	let scrollElm = document.body;
	if (scrollElm.clientHeight === scrollElm.scrollHeight) {
		scrollElm = document.documentElement;
	}
	return scrollElm;
};

export default getPageScrollElm;
