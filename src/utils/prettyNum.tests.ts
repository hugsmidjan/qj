import o from 'ospec';

import { prettyNum } from './prettyNum';

const lang = 'testing';

o.spec('prettyNum()', () => {
  o('prettyNum invalid inputs', () => {
    o(prettyNum()).equals('');
    o(prettyNum(NaN)).equals('');
    o(prettyNum('bob')).equals('');
  });
  o('prettyNum', () => {
    o(prettyNum(42)).equals('42');
    o(prettyNum(42, { lang })).equals('42');
    o(prettyNum(123456789)).equals('123,456,789');
    o(prettyNum(123456789, { lang })).equals('123.456.789');
    o(prettyNum(123456.789123, { decimals: 2 })).equals('123,456.79');
    o(prettyNum(123456.789123, { decimals: 2, lang })).equals('123.456,79');
    o(prettyNum(56.12345, { decimals: 2, fixedDecimals: true })).equals('56.12');
    o(prettyNum(56.12345, { decimals: 2, fixedDecimals: true, lang })).equals('56,12');
    o(prettyNum(1 - 0.7)).equals('0');
    o(prettyNum(1 - 0.7, { lang })).equals('0');
    o(prettyNum(1 - 0.7, { decimals: 4 })).equals('0.3000');
    o(prettyNum(1 - 0.7, { decimals: 4, lang })).equals('0,3000');
    o(prettyNum(0.123456789, { leadingZero: false, decimals: 3 })).equals('.123');
    o(prettyNum(0.123456789, { leadingZero: false, decimals: 3, lang })).equals(',123');
  });
  o('prettyNum custom splitters', () => {
    o(prettyNum(1234.56789, { decimals: 3, splitters: ['.', ','] })).equals('1,234.568');
    o(prettyNum(123456.789, { decimals: 2, splitters: [',', ''] })).equals('123456,79');
    o(prettyNum(123456.789, { decimals: 1, splitters: [','] })).equals('123456,8');
    o(prettyNum(123456.789, { decimals: 2, splitters: ['', ''] })).equals('123456.79');
  });
  o('prettyNum string numbers', () => {
    o(prettyNum('42', { decimals: 2 })).equals('42')('no lang');
    o(prettyNum('42', { decimals: 2, lang })).equals('42')(lang);
    o(prettyNum('42', { decimals: 2, fixedDecimals: true })).equals('42.00')(
      'fixed decimals appended to integer'
    );
    o(prettyNum('42', { decimals: 2, fixedDecimals: true, lang })).equals('42,00')(
      'fixed decimals appended to integer'
    );
    o(prettyNum('000123456789')).equals('123,456,789');
    o(prettyNum('000123456789', { lang })).equals('123.456.789');
  });
  o('prettyNum negative numbers', () => {
    o(prettyNum(-1234.56, { decimals: 2 })).equals('-1,234.56');
    o(prettyNum(-1234.56, { decimals: 2, lang })).equals('-1.234,56');
    o(prettyNum(-0.12, { decimals: 2 })).equals('-0.12');
    o(prettyNum(-0.12, { decimals: 2, lang })).equals('-0,12');
  });
});
