if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
	// Polyfill `new Event()` in IE11
	const CustomEvent = function (event, params) {
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined,
		};
		const evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};
	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
	window.Event = CustomEvent;
}
