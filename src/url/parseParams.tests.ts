import o from 'ospec';
import parseParams from './parseParams';

const window = global as any;
const hasDoc = 'document' in window;
const _doc = window.document;

o.spec('parseParams', () => {
	o.before(() => {
		const mockDoc = { location: { search: 'param1=foo' } };
		window.document = mockDoc;
	});
	o.after(() => {
		if (hasDoc) {
			window.document = _doc;
		} else {
			delete window.document;
		}
	});
	o('Parses params', () => {
		o(parseParams('foo=bar')).deepEquals({ foo: ['bar'] });
		o(parseParams('?foo=bar')).deepEquals({ foo: ['bar'] });
		o(parseParams('&foo=bar')).deepEquals({ foo: ['bar'] });
		o(parseParams('foo=bar&foo2=baz')).deepEquals({ foo: ['bar'], foo2: ['baz'] });
	});

	o('URI decodes param names and values', () => {
		const e = encodeURIComponent;
		o(parseParams(e('fú') + '=' + e('þár'))).deepEquals({ fú: ['þár'] });
	});

	o('Collects repeat params into array', () => {
		o(parseParams('foo=bar&foo=bar2')).deepEquals({ foo: ['bar', 'bar2'] });
		o(parseParams('foo=bar&foo2=baz&foo=bar2')).deepEquals({
			foo: ['bar', 'bar2'],
			foo2: ['baz'],
		});
	});

	o('Defaults to document.location.search', () => {
		o(document.location.search).equals('param1=foo');
		o(parseParams()).deepEquals({ param1: ['foo'] });
	});

	o('Returns an empty object for empty inputs', () => {
		o(parseParams('')).deepEquals({});
		o(parseParams(undefined)).deepEquals({});
	});

	/** /
	o('Accepts generic types', () => {
		const p = parseParams<'foo'>('foo=bar');
		o(p.foo[0]).equals('bar');
		// $ExpectError
		o(p.bar).equals(undefined);
	});
	/**/
});
