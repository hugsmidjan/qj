import o from 'ospec';
import validEmail from './validEmail';

o.spec('validEmail', () => {
	o('Validates emails', () => {
		o(validEmail('test@test.com')).equals(true);
		o(validEmail('test.test@test.co.uk')).equals(true);
		o(validEmail('a@b.com')).equals(true);
		o(validEmail('test')).equals(false);
		o(validEmail('test@')).equals(false);
		o(validEmail('@test.com')).equals(false);
		o(validEmail('test@test@test.com')).equals(false);
	});

	o('Treats empty (and falsy) input as "valid"', () => {
		o(validEmail('')).equals(true);

		// @ts-expect-error  (testing invalid input)
		o(validEmail(undefined)).equals(true);
		// @ts-expect-error  (testing invalid input)
		o(validEmail(false)).equals(true);
	});
});
