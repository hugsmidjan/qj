import o from 'ospec';

import classes from './classes';

o.spec('getModifierClass', () => {
  o('Accepts string and/or string arrays', () => {
    o(classes('A')).equals('A');
    o(classes('B', 'C', 'D')).equals('B C D');
    o(classes('E', ['F'], ['G'])).equals('E F G');
    o(classes(['H', 'I', 'J'])).equals('H I J');
    o(classes(['K', [['L'], 'M']])).equals('K L M');
  });

  o('Ignores empty/nully values', () => {
    (['', undefined, false, null] as const).forEach((modifier) => {
      o(classes(modifier)).equals('');
    });
    o(classes(null, 'A', ['', ['B', undefined], false])).equals('A B');
    o(classes('A', ['', [null, undefined]])).equals('A');
  });

  o('Does NOT trim or otherwise clean up strings', () => {
    const borked = [' borked ', '  value '];
    o(classes(borked)).equals(borked.join(' '));
  });

  o('Simply casts numbers and `true` values to string', () => {
    // @ts-expect-error  (testing invalid input)
    o(classes(10, 9.9, true)).equals('10 9.9 true');
  });

  o('Does NOT dedupe class-names', () => {
    o(classes('A', 'A', 'A')).equals('A A A');
  });
});
