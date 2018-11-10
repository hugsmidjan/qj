import jsdom from 'jsdom';
global.document = new jsdom.JSDOM('<html/>').window.document;
