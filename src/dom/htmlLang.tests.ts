import '../__testing/polyfill-document';

import o from 'ospec';

import q from '../select/q';

import htmlLang from './htmlLang';

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
    const divElm = q('div');
    const bElm = q('b');
    const pElm = q('p');

    o(htmlLang(divElm)).equals('es')('picks up own lang');
    o(htmlLang(bElm)).equals('es')('finds ancestor lang');
    o(htmlLang(pElm)).equals('is')("falls back on <html/>'s lang");
    o(htmlLang(pElm, true)).equals('is-is')('optionally returns full/long language code');
    o(htmlLang(divElm, true)).equals('es')('optionally returns full/long language code');

    o(htmlLang()).equals('is')('defaults to checking <html/>');
    o(htmlLang(true)).equals('is-is')(
      'optionally returns full/long language code for <html/> default'
    );

    htmlElm.removeAttribute('lang');
    o(htmlLang(pElm)).equals(undefined)(
      'returns undefined if no lang attribute is found'
    );
  });

  o('returns undefied for nully Nodes', () => {
    htmlElm.setAttribute('lang', 'it');
    o(htmlLang(undefined)).equals(undefined);
    o(htmlLang(null)).equals(undefined);
  });

  o('works with non-html elements and text nodes', () => {
    htmlElm.setAttribute('lang', 'ru');
    document.body.innerHTML = '<div lang="fr">text node <svg/></div>';
    const textNode = (q('div') as HTMLElement).firstChild;
    const svgElm = q('svg');
    o(htmlLang(textNode)).equals('fr')('text node');
    o(htmlLang(svgElm)).equals('fr')('<svg/> element');
  });

  o('works with detatched elements', () => {
    htmlElm.setAttribute('lang', 'jp');
    const rootElm = document.createElement('div');
    rootElm.innerHTML = '<div lang="se"><span><b>foo</b></span></div> <p>bar</p>';
    const divElm = q('div', rootElm);
    const bElm = q('b', rootElm);
    const pElm = q('p', rootElm);

    o(htmlLang(divElm)).equals('se')('picks up own lang');
    o(htmlLang(bElm)).equals('se')('finds ancestor lang');
    o(htmlLang(pElm)).equals(undefined)(
      'returns undefined if no lang attribute is found'
    );
  });
});
