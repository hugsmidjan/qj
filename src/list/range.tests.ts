import o from 'ospec';

import range from './range';

o.spec('range', () => {
  o('makes basic ranges', () => {
    o(range(1, 4)).deepEquals([1, 2, 3, 4])('makes a range');
    o(range(10, 14)).deepEquals([10, 11, 12, 13, 14])('accepts arbitrary from values');
    o(range(-2, 2)).deepEquals([-2, -1, 0, 1, 2])('can start from a negative value');
    o(range(0, 2, 0.5)).deepEquals([0, 0.5, 1, 1.5, 2])('handles small steps');
    o(range(1, 5, 2)).deepEquals([1, 3, 5])('handles custom steps');
    o(range(1, 1)).deepEquals([1])('Tolerates from and to being the same');
  });

  o('makes descending ranges', () => {
    o(range(5, 3)).deepEquals([5, 4, 3])('makes a range');
    o(range(2, -2)).deepEquals([2, 1, 0, -1, -2])('safely crosses into negative values');
    o(range(2, 0, 0.5)).deepEquals([2, 1.5, 1, 0.5, 0])('handles small steps');
    o(range(5, 1, 2)).deepEquals([5, 3, 1])('handles custom steps');
  });

  o('Last value is limited by `step`', () => {
    // I.e. the `step` size is fixed the last value
    // never overshoots the limit set by the `to` parameter
    o(range(1, 5, 3)).deepEquals([1, 4]);
    o(range(1, 5, 100)).deepEquals([1]);
    o(range(5, 1, 3)).deepEquals([5, 2]);
    o(range(5, 1, 100)).deepEquals([5]);
  });

  o('Throws on invalid/NaN `to`/`from` inputs', () => {
    o(() => range(1, NaN)).throws(Error);
    o(() => range(NaN, 10, 2)).throws(Error);
    // @ts-expect-error  (testing invalid input)
    o(() => range('1', '4')).throws(Error)('treat numeric strings as invalid');
    // @ts-expect-error  (testing invalid input)
    o(() => range(1, 'a')).throws(Error);
    // @ts-expect-error  (testing invalid input)
    o(() => range('a', 'z')).throws(Error);
  });

  o('invalid steps are ignored', () => {
    // zero step size is just silly
    o(range(1, 4, 0)).deepEquals([1, 2, 3, 4]);
    // NOTE: decending ranges MUST be expressed by `from > to`.
    // Negative `step` values are ignored
    o(range(1, 4, -1)).deepEquals([1, 2, 3, 4]);
    o(range(4, 1, -1)).deepEquals([4, 3, 2, 1]);
    // gracefully ignore NaN
    o(range(1, 4, NaN)).deepEquals([1, 2, 3, 4]);
    // @ts-expect-error  (testing invalid input)
    o(range(1, 4, '3')).deepEquals([1, 2, 3, 4])('treat numeric strings as invalid');
  });
});
