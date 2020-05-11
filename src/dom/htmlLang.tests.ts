import o from 'ospec';
import '../__testing/polyfill-document';
import htmlLang from './htmlLang';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement;

// ---------------------------------------------------------------------------

o.spec('htmlLang', () => {
	const htmlElm = document.documentElement;
	let beforeLang: string | null;
	o.before(() => {
		beforeLang = htmlElm.getAttribute('lang');
		htmlElm.setAttribute('lang', 'is-IS');
	});
	o.after(() => {
		beforeLang == null
			? htmlElm.removeAttribute('lang')
			: htmlElm.setAttribute('lang', beforeLang);
	});

	o('works with elements in the DOM', () => {
		document.body.innerHTML = '<div lang="es"><span><b>foo</b></span></div> <p>bar</p>';
		const divElm = $('div');
		const bElm = $('b');
		const iElm = $('i');

		o(htmlLang(divElm)).equals('es')('picks up own lang');
		o(htmlLang(bElm)).equals('es')('finds ancestor lang');
		o(htmlLang(iElm)).equals('is')("falls back on <html/>'s lang");
		o(htmlLang(iElm, true)).equals('is-is')('optionally returns full/long language code');
		o(htmlLang(divElm, true)).equals('es')('optionally returns full/long language code');

		o(htmlLang()).equals('is')('defaults to checking <html/>');
		o(htmlLang(true)).equals('is-is')(
			'optionally returns full/long language code for <html/> default'
		);

		htmlElm.removeAttribute('lang');
		o(htmlLang(iElm)).equals(undefined)(
			'returns undefined if no lang attribute is found'
		);
	});

	o('works with detatched elements', () => {
		const elm = document.createElement('div');
		elm.innerHTML = '<div lang="es"><span><b>foo</b></span></div> <p>bar</p>';
		const divElm = $('div');
		const bElm = $('b');
		const iElm = $('i');

		o(htmlLang(divElm)).equals('es')('picks up own lang');
		o(htmlLang(bElm)).equals('es')('finds ancestor lang');
		o(htmlLang(iElm)).equals(undefined)(
			'returns undefined if no lang attribute is found'
		);
	});
});
