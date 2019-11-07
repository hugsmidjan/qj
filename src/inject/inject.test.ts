import o from 'ospec';
import inject from './inject';

o.spec('inject()', () => {
	o('injects variables into a template string', () => {
		o(inject('Hello %{name}!', { name: 'World' })).equals('Hello World!');
		o(inject('Hello %{name}, %{name}!', { name: 'World' })).equals('Hello World, World!');
		o(inject('Hello %{name}%{name}!', { name: 'World' })).equals('Hello WorldWorld!');
		o(inject('Hello %{first} %{last}!', { first: 'John', last: 'Doe' })).equals(
			'Hello John Doe!'
		);
	});

	o('accepts arrayed variables', () => {
		o(inject('Hello %{1}! Have a %{0}', ['banana', 'John'])).equals(
			'Hello John! Have a banana'
		);
	});

	o('accepts a mixed array + named props variables', () => {
		const vars = ['banana'] as Array<string> & { name: string };
		vars.name = 'John';
		o(inject('Hello %{name}! Have a %{0}', vars)).equals('Hello John! Have a banana');
	});

	o('Leaves unmatched tokens as is', () => {
		o(inject('Hello %{name}!', {})).equals('Hello %{name}!');
	});

	o('variables may be functions', () => {
		o(
			inject('Hello %{name}!', {
				name: (key: string) => (key === 'name' ? 'World' : 'Bob'),
			})
		).equals('Hello World!');
	});
});
