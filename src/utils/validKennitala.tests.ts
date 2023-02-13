import o from 'ospec';
import validKennitala from './validKennitala';

o.spec('validKenntitala', () => {
	const ktPerson = '1012755239';
	const ktCompany = '5001012880';
	const ktGervi = '0101307789';
	const ktInvalid1 = '1212657890';
	const ktInvalid2 = '10127552';

	const kt_Person1 = '101275-5239';
	const kt_Company = '500101 2880';
	const kt_Company2 = '500101 - 2880';
	const kt_Gervi = '010130 - 7789';
	const kt_Malformed1 = ' 10-1275-52 39';
	const kt_Malformed2 = ' 101275-52';
	const kt_Malformed2_EmDash = '101275—5239';

	o('Validates simple kennitalas', () => {
		o(validKennitala(ktPerson)).equals(true);
		o(validKennitala(ktCompany)).equals(true);
		o(validKennitala(ktGervi)).equals(false);
		o(validKennitala(ktInvalid1)).equals(false);
		o(validKennitala(ktInvalid2)).equals(false);
	});

	o('Treats empty (and falsy) input as "valid"', () => {
		o(validKennitala('')).equals(true);

		// @ts-expect-error  (testing invalid input)
		o(validKennitala(undefined)).equals(true);
		// @ts-expect-error  (testing invalid input)
		o(validKennitala(false)).equals(true);
	});

	o('Accepts kennitalas with spaces and dashes', () => {
		o(validKennitala(kt_Person1)).equals(true);
		o(validKennitala(kt_Company)).equals(true);
		o(validKennitala(kt_Company2)).equals(true);
	});

	o('Accepts malformed kennitals with aggressive clean option', () => {
		o(validKennitala(kt_Malformed1)).equals(false);
		o(validKennitala(kt_Malformed1, { clean: 'aggressive' })).equals(true);
		o(validKennitala(`(kt. ${kt_Person1})`, { clean: 'aggressive' })).equals(true);
		o(validKennitala(`(kt. ${kt_Person1} blöö)`, { clean: 'aggressive' })).equals(true);
		o(
			validKennitala(`(kt. ${kt_Person1}${kt_Person1})`, {
				clean: 'aggressive',
			})
		).equals(false);
		o(
			validKennitala(`(kt. ${kt_Person1} - s. 765 4321)`, {
				clean: 'aggressive',
			})
		).equals(false);
		o(validKennitala(kt_Malformed2_EmDash, { clean: 'aggressive' })).equals(false)(
			'en-dash is not accepted'
		);
	});

	o('Optionally distinguishes between persons and companies', () => {
		o(validKennitala(ktPerson, { type: 'einst' })).equals(true);
		o(validKennitala(ktPerson, { type: 'fyrirt' })).equals(false);
		o(validKennitala(ktCompany, { type: 'einst' })).equals(false);
		o(validKennitala(ktCompany, { type: 'fyrirt' })).equals(true);
	});

	o('Invalid `type` flags are ignored', () => {
		// @ts-expect-error  (testing invalid input)
		o(validKennitala(ktPerson, { type: 'foo' })).equals(true);
		// @ts-expect-error  (testing invalid input)
		o(validKennitala(ktCompany, { type: 'foo' })).equals(true);
	});

	o('Optionally allows Gervimaður', () => {
		o(validKennitala(ktGervi, { robot: true })).equals(true);
		o(validKennitala(ktGervi, { robot: false })).equals(false);
		// robot flag has no effect on other functions
		o(validKennitala(ktPerson, { robot: true })).equals(true);
		o(validKennitala(ktPerson, { robot: true, type: 'einst' })).equals(true);
		o(validKennitala(ktPerson, { robot: true, type: 'fyrirt' })).equals(false);
	});

	o('Exposes (careful) clean function', () => {
		o(validKennitala.clean(' 123456-7890')).equals('1234567890');
		o(validKennitala.clean('123456 7890 ')).equals('1234567890');
		o(validKennitala.clean(' 123456 - 7890')).equals('1234567890');
		o(validKennitala.clean('123456 -7890')).equals('1234567890');
		// trims only
		o(validKennitala.clean(' abc ')).equals('abc');
		o(validKennitala.clean('kt. 123456-7890')).equals('kt. 123456-7890');
		o(validKennitala.clean(' 1234-567890')).equals('1234-567890');
		o(validKennitala.clean('123 456-7890')).equals('123 456-7890');
		o(validKennitala.clean(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash);
	});

	o('Exposes aggressive clean function', () => {
		o(validKennitala.cleanAggressive(' 123456-7890')).equals('1234567890');
		o(validKennitala.cleanAggressive('123456 7890 ')).equals('1234567890');
		o(validKennitala.cleanAggressive(' 123456 - 7890')).equals('1234567890');
		o(validKennitala.cleanAggressive('123456 -7890')).equals('1234567890');

		o(validKennitala.cleanAggressive(' 12 34 56 - 78 90')).equals('1234567890');
		o(validKennitala.cleanAggressive('1-2-3 4-5 6-7-8 9-0')).equals('1234567890');

		o(validKennitala.cleanAggressive('(kt. 123456-7890)')).equals('1234567890');
		o(validKennitala.cleanAggressive('(kt. 123456-7890, s. 765 4321) ')).equals(
			'1234567890,s.7654321'
		)('does not clean non-digits in the middle of the string');
		o(validKennitala.cleanAggressive('(s. 765 4321) ')).equals('7654321')(
			'does not check for length'
		);
		o(validKennitala.cleanAggressive(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash)(
			'en-dashes are not accepted'
		);
	});

	o('Exposes a simple formatter', () => {
		o(validKennitala.format('101275-5239 ')).equals('101275-5239');
		o(validKennitala.format('1012755239')).equals('101275-5239');
		o(validKennitala.format(' 5001012880 ')).equals('500101-2880');
		o(validKennitala.format('500101 - 2880')).equals('500101-2880');
		o(validKennitala.format(' 010130 7789')).equals('010130-7789');
		o(validKennitala.format(kt_Malformed1)).equals(kt_Malformed1);
		o(validKennitala.format(kt_Malformed2)).equals(kt_Malformed2);
		o(validKennitala.format(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash);
	});

	o('Exposes a birthday function', () => {
		const p1BDay = validKennitala.getBirthday(ktPerson);
		o(p1BDay?.toISOString().substr(0, 10)).equals('1975-12-10');
		const p2BDay = validKennitala.getBirthday(kt_Person1);
		o(p2BDay?.toISOString().substr(0, 10)).equals('1975-12-10');
		const cBDay = validKennitala.getBirthday(kt_Company);
		o(cBDay?.toISOString().substr(0, 10)).equals('2001-01-10');
		const iBDay = validKennitala.getBirthday(ktInvalid1);
		o(iBDay?.toISOString().substr(0, 10)).equals('2065-12-12')(
			'Kennitalas are not validated'
		);
		const i2BDay = validKennitala.getBirthday(kt_Malformed1);
		o(i2BDay).equals(undefined)('Malformed digit-strings return undefined');
		const i3BDay = validKennitala.getBirthday('bogus');
		o(i3BDay).equals(undefined)('Bogus strings return undefined');
	});
});
