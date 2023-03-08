import o from 'ospec';

import regEscape from './regEscape';

o.spec('regEscape()', () => {
  o('Escapes strings', () => {
    o(regEscape('[...]')).equals('\\[\\.\\.\\.\\]');
    o(regEscape('a|b')).equals('a\\|b');
    o(regEscape('a\\b')).equals('a\\\\b');
    o(new RegExp('^' + regEscape('a\\b') + '$').test('a\\b')).equals(true);
  });
});
