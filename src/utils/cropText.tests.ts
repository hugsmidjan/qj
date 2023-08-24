import o from 'ospec';

import cropText from './cropText';

const text = 'The quick brown fox jumps over the lazy dog !'; // 45 characters
const longWord = 'Lánskjaravístöluútreiknilíkan '; // 30 characters
const ell = ' …'; // 2 characters
const dumbEll = ' ……………………'; // 9 characters

o.spec('cropText', () => {
  o('works', () => {
    o(cropText(text, 20)).equals(`The quick brown fox${ell}`)('crops and adds ellipsis');
    o(cropText(text, 1000)).equals(text)('does not crop unless needed');
    o(cropText(text, 23)).equals(`The quick brown fox${ell}`)('crops at word boundaries');
    o(cropText(text, text.length - 1)).equals(text)(
      'accounts for ellipsis length when deciding to crop'
    );
    o(cropText(text, text.length - (dumbEll.length - 2), dumbEll)).equals(text)(
      'accounts for dumb ellipsis length when deciding to crop'
    );
    o(cropText(text, 20, dumbEll)).equals('The quick brown' + dumbEll)(
      'accounts for HALF the ellipsis length when performing the crop'
    );
  });

  o('lack of spaces is not a problem', () => {
    const halve = (str: string) => Math.floor((str.length - 1) / 2);
    o(cropText(longWord + text, 15)).equals(longWord.slice(0, 15 - halve(ell)) + ell)(
      'splits words if forced to'
    );
    o(cropText(longWord + text, 15, dumbEll)).equals(
      longWord.slice(0, 15 - halve(dumbEll)) + dumbEll
    )('splits words based on HALF of the ellipsis length');
  });

  o('Allows skipping the ellipsis', () => {
    o(cropText(text, 20, '')).equals(`The quick brown fox`);
  });

  o('whitespace is trimmed, normalized and collapsed', () => {
    o(cropText(' a\t\nb   c ', 1000)).equals('a b c')('normalizes whitespace');
    o(cropText(' a\t\nb   c ', 4)).equals('a b c')('normalizing happens before cropping');
  });

  o('handles dumb input predictably', () => {
    o(cropText(text, 0)).equals(ell)('zero length crops simply return the ellipsis');
    o(cropText(text, 18.7)).equals('The quick brown fox' + ell)('accepts floats');
    o(cropText(text, 18.1)).equals('The quick brown' + ell)('rounds floats');
  });

  o('handles invalid/bad input predictably', () => {
    // @ts-expect-error  (testing invalid input)
    const lengthUndef: number = undefined;
    o(cropText(text, lengthUndef)).equals(text)(
      'undefined length is treaded a inifinite length'
    );
  });
});
