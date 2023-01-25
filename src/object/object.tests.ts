import o from 'ospec';
import beget from './beget';
import { objectClean, objectIsSame } from './object';

// ===========================================================================

o.spec('objectClean', () => {
	type T1 = {
		a: string;
		a2: number | null;
		b: number | undefined;
		b2: number | undefined | null;
		c?: string | null;
		c2?: number;
		d?: string | undefined;
	};
	type AssertSame<A, B, Ar = Required<A>, Br = Required<B>> = Ar extends Br
		? Br extends Ar
			? true
			: never
		: never;

	/* eslint-disable @typescript-eslint/no-unused-vars */
	const foo1 = objectClean({} as T1, true);
	const foo1b: AssertSame<
		{
			a: string;
			a2?: number;
			b?: number;
			b2?: number;
			c?: string;
			c2?: number;
			d?: string;
		},
		typeof foo1
	> = true;

	const foo2 = objectClean({} as T1);
	const foo2b: AssertSame<
		{
			a: string;
			a2: number | null;
			b?: number;
			b2?: number | null;
			c?: string | null;
			c2?: number;
			d?: string;
		},
		typeof foo2
	> = true;
	/* eslint-enable @typescript-eslint/no-unused-vars */

	// -------------------------------------

	o('Removes undefineds', () => {
		const obj = { a: 1, b: undefined, c: null };
		const cleaned = objectClean(obj);
		o('b' in cleaned).equals(false);
		o(cleaned.c).equals(null);
		o(Object.keys(cleaned).length).equals(2);
	});

	o('Optionally removes nulls also', () => {
		const obj = { a: 1, b: undefined, c: null };
		const cleaned = objectClean(obj, true);
		o(cleaned.a).equals(1);
		o('b' in cleaned).equals(false);
		o('c' in cleaned).equals(false);
		o(Object.keys(cleaned).length).equals(1);
	});

	o('Does not mutate the original', () => {
		const obj = { a: 1, b: undefined };
		const cleaned = objectClean(obj);
		o(cleaned).notEquals(obj);
		o(obj.a).equals(1);
		o(obj.b).equals(undefined);
		o(Object.keys(obj).length).equals(2);
	});

	o('Returns the original if no change', () => {
		const obj = { a: 1, b: null };
		const cleaned = objectClean(obj);
		o(cleaned).equals(obj);
		o(Object.keys(cleaned).length).equals(2);
	});
});

// ===========================================================================

o.spec('objectIsSame', () => {
	o('simple case', () => {
		const xy = { x: 1, y: 2 };
		const xy2 = { x: 1, y: 2 };
		const xyz = { x: 1, y: 2, z: 3 };

		o(objectIsSame(xy, xy)).equals(true)('literally same');
		o(objectIsSame(xy, xy2)).equals(true)('same content');
		o(objectIsSame(xy, xyz)).equals(false)('B has extra properties');
		o(objectIsSame(xyz, xy)).equals(false)('B is missing properties');
	});

	o('works for Arrays', () => {
		const arr = [5, undefined, 2];
		o(objectIsSame(arr, arr)).equals(true)('literally same');
		o(objectIsSame(arr, [5, undefined, 2])).equals(true)('same values');
		o(objectIsSame(arr, [undefined, 5, 2])).equals(false)('same values, different order');
		o(objectIsSame([99], [99, undefined])).equals(false)('different length');

		const arrCloned = [].concat.call([], arr);
		arrCloned.length = 10;
		o(objectIsSame(arr, arrCloned)).equals(true)(
			'Array#length does not throw off the comparison'
		);
	});

	o('captures explicly undefined values', () => {
		o(objectIsSame({ x: undefined }, { y: 2 })).equals(false)('literally same');
	});

	o('ignores prototype chain properties', () => {
		const xy = { x: 1, y: 2 };
		const xyz = { x: 1, y: 2, z: 3 };
		const xyInherited = beget(xy);
		const xy_zInherited = beget(xyz, { x: 1, y: 2 });

		o(objectIsSame(xyInherited, xy)).equals(false)('A inherits properties ');
		o(objectIsSame(xy, xyInherited)).equals(false)('B inherits properties');
		o(objectIsSame(xy, xy_zInherited)).equals(true)('B has extra inherited properties');
		o(objectIsSame(xy_zInherited, xy)).equals(true)('B is missing inherited properties');
	});

	o('works for Arrays', () => {
		const arr = [5, undefined, 2];
		o(objectIsSame(arr, arr)).equals(true)('literally same');
		o(objectIsSame(arr, [5, undefined, 2])).equals(true)('same values');
		o(objectIsSame(arr, [undefined, 5, 2])).equals(false)('same values, different order');
		o(objectIsSame([99], [99, undefined])).equals(false)('different length');
	});
});
