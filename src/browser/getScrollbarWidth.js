const doc = document;

const getScrollbarWidth = !(doc && doc.body)
	? () => {
			return 0;
	  }
	: () => {
			const scrollDiv = doc.createElement('div');
			scrollDiv.style.cssText =
				'position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll;';
			doc.body.appendChild(scrollDiv);
			const scrollbarWidth =
				scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
			doc.body.removeChild(scrollDiv);
			return scrollbarWidth;
	  };

export default getScrollbarWidth;
