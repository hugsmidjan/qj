import o from 'ospec';
import makeQueryString, { ParamsObject } from './makeQueryString';

o.spec('makeQueryString', () => {
	const tests: Record<string, ParamsObject> = {
		'foo=bar': { foo: 'bar' },
		'foo=bar&baz=smu': { foo: 'bar', baz: 'smu' },
		'baz=smu&foo=bar': { baz: 'smu', foo: 'bar' },
		'foo=one&foo=two': { foo: ['one', 'two'] },
		'foo=false&foo=true': { foo: [false, true] },
		'foo=true&bar=false': { foo: true, bar: false },
		foo: { foo: '', bar: null, baz: undefined },
		'foo&bar=0': { foo: ['', null, undefined], bar: 0 },
		'bar=0': { foo: [null, undefined], bar: 0 },
		'foo=%C3%9E%C3%BA%3F%26%3D%25': { foo: 'Þú?&=%' },
	};

	o('makes query strings', () => {
		Object.entries(tests).forEach(([expected, paramsObj]) => {
			o(makeQueryString(paramsObj)).equals(expected);
		});
	});
	o("won't accept nully input", () => {
		o(() => {
			// @ts-ignore  (Shameful, I know)
			makeQueryString();
		}).throws(Error);
		o(() => {
			// @ts-ignore  (Shameful, I know)
			makeQueryString(null);
		}).throws(Error);
	});
});
