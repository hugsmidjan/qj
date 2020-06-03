import jsdom from 'jsdom';

if (!('window' in global)) {
	const window = new jsdom.JSDOM('<html/>').window;
	// @ts-ignore  (we're willfully extending the global object)
	global.window = window.window;
	// @ts-ignore  (we're willfully extending the global object)
	global.document = window.document;
	// @ts-ignore  (we're willfully extending the global object)
	global.Element = window.Element;
}
