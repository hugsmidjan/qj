import o from 'ospec';
import shuffle from './shuffle';

o.spec('shuffle', () => {
	o('returns new array by default', () => {
		const arr = ['a', 'b', 'c', 'd'];
		const shuffled = shuffle(arr);

		o(shuffled instanceof Array).equals(true);
		o(shuffled.length).equals(arr.length);
		o(shuffled).notEquals(arr);
	});

	o('optionally shuffles array in place', () => {
		const arr = ['a', 'b', 'c', 'd'];
		const shuffled = shuffle(arr, true);

		o(shuffled).equals(arr);
	});

	o("won't accept nully input", () => {
		o(() => {
			// @ts-expect-error  (testing invalid input)
			shuffle();
		}).throws(Error);
		o(() => {
			// @ts-expect-error  (testing invalid input)
			shuffle(null);
		}).throws(Error);
	});
});
