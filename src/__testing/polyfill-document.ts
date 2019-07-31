import jsdom from 'jsdom';
const window = new jsdom.JSDOM('<html/>').window;

// global.Document = window.Document;
// @ts-ignore  (we're willfully extending the global object)
global.document = window.document;
