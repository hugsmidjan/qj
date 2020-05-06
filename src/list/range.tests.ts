import o from 'ospec';
import range from './range';

o.spec('range', () => {
	o('makes basic ranges', () => {
		o(range(1, 4)).deepEquals([1, 2, 3, 4]);
		o(range(10, 14)).deepEquals([10, 11, 12, 13, 14]);
		o(range(-2, 2)).deepEquals([-2, -1, 0, 1, 2]);
		o(range(1, 5, 2)).deepEquals([1, 3, 5]);
		o(range(1, 1)).deepEquals([1]);
	});

	o('makes descending ranges', () => {
		o(range(4, 1)).deepEquals([4, 3, 2, 1]);
		o(range(14, 10)).deepEquals([14, 13, 12, 11, 10]);
		o(range(2, -2)).deepEquals([2, 1, 0, -1, -2]);
		o(range(5, 1, 2)).deepEquals([5, 3, 1]);
	});

	o('Last value is limited by `step`', () => {
		// I.e. the `step` size is fixed the last value
		// never overshoots the limit set by the `to` parameter
		o(range(1, 5, 3)).deepEquals([1, 4]);
		o(range(1, 5, 100)).deepEquals([1]);
		o(range(5, 1, 3)).deepEquals([5, 2]);
		o(range(5, 1, 100)).deepEquals([5]);
	});

	o('invalid steps are ignored', () => {
		o(range(1, 4, 0)).deepEquals([1, 2, 3, 4]);
		o(range(1, 4, -1)).deepEquals([1, 2, 3, 4]);
		o(range(1, 4, NaN)).deepEquals([1, 2, 3, 4]);

		o(range(4, 1, 0)).deepEquals([4, 3, 2, 1]);
		o(range(4, 1, -1)).deepEquals([4, 3, 2, 1]);
		o(range(4, 1, NaN)).deepEquals([4, 3, 2, 1]);
	});
});
