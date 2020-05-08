import o from 'ospec';
import arrayToObject from './arrayToObject';

const arr1 = ['Orange', 'Apple', 'Tomato', 'Apple', 'Apple'] as const;
const arr2 = [2, 3, 4, 6, 3, 2, 0] as const;
const arr3 = [
	{ name: 'Tim', age: 12 },
	{ name: 'Sam', age: 10 },
	{ name: 'Tim', age: 29 },
] as const;

o.spec('arrayToObject', () => {
	o('Maps string and number arrays', () => {
		o(arrayToObject(arr1)).deepEquals({
			Orange: 'Orange',
			Apple: 'Apple',
			Tomato: 'Tomato',
		});
		o(arrayToObject(arr2)).deepEquals({ 2: 2, 3: 3, 4: 4, 6: 6, 0: 0 });
		o(arrayToObject(arr3, 'name')).deepEquals({
			Tim: { name: 'Tim', age: 12 },
			Sam: { name: 'Sam', age: 10 },
		});
	});

	o('Accepts prop functions', () => {
		o(arrayToObject(arr1, (item) => item.toUpperCase())).deepEquals({
			ORANGE: 'Orange',
			APPLE: 'Apple',
			TOMATO: 'Tomato',
		});
		o(arrayToObject(arr2, (item) => Math.floor(item / 2) + '')).deepEquals({
			1: 2,
			2: 4,
			3: 6,
			0: 0,
		});
		o(arrayToObject(arr3, (item) => item.name + '|' + item.age)).deepEquals({
			'Tim|12': { name: 'Tim', age: 12 },
			'Sam|10': { name: 'Sam', age: 10 },
			'Tim|29': { name: 'Tim', age: 29 },
		});
	});

	o('Accepts strings', () => {
		o(arrayToObject('hello world')).deepEquals({
			h: 'h',
			e: 'e',
			l: 'l',
			o: 'o',
			' ': ' ',
			w: 'w',
			r: 'r',
			d: 'd',
		});
		o(arrayToObject('')).deepEquals({});
	});

	o('Returns empty object on weird/invalid input', () => {
		// @ts-ignore  (testing weird input)
		o(arrayToObject({ a: 'foo', b: 'bar' })).deepEquals({});
		// @ts-ignore  (testing invalid input)
		o(arrayToObject(true)).deepEquals({});
		// @ts-ignore  (testing invalid input)
		o(arrayToObject(false)).deepEquals({});
		// @ts-ignore  (testing invalid input)
		o(arrayToObject(42)).deepEquals({});
		// @ts-ignore  (testing invalid input)
		o(arrayToObject(0)).deepEquals({});
		// @ts-ignore  (testing invalid input)
		o(arrayToObject(null)).deepEquals({});
		// @ts-ignore  (testing invalid input)
		o(arrayToObject(undefined)).deepEquals({});
		// @ts-ignore  (testing invalid input)
	});
});
