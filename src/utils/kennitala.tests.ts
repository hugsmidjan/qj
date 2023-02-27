import o from 'ospec';
import { Equals, Expect } from '../__testing/types';
import {
	parseKennitala,
	isValidKennitala,
	cleanKennitalaCareful,
	cleanKennitalaAggressive,
	formatKennitala,
	getKennitalaBirthDate,
	Kennitala,
	KennitalaPerson,
	KennitalaCompany,
	KennitalaData,
	KennitalaType,
	KennitalaDataPerson,
	KennitalaDataCompany,
	isPersonKennitala,
	isCompanyKennitala,
} from './kennitala';

const ktPerson = '1012755239';
const ktCompany = '5001012880';
const ktGervi = '0101307789';
const ktInvalid1 = '1212657890';
const ktInvalid2 = '10127552';

const kt_Person1 = '101275-5239';
const kt_Person1_EnDash = '101275– 5239';
const kt_Company = '500101 2880';
const kt_Company2 = '500101 - 2880';

const kt_Malformed1 = ' 10-1275-52 39';
const kt_Malformed2 = ' 101275-52';
const kt_Malformed3 = '101275   - 5239';
const kt_Malformed2_EmDash = '101275—5239';

const satisfies = (
	actual: KennitalaData | undefined,
	satisfy: Partial<KennitalaData>
) => {
	o(actual).notEquals(undefined);
	if (actual) {
		Object.entries(satisfy).forEach(([key, expected]) => {
			o(actual[key as keyof KennitalaData]).equals(expected);
		});
	}
};

o.spec('parseKennitala', () => {
	const dataPerson = {
		value: ktPerson as KennitalaPerson,
		type: 'person',
		robot: false,
		formatted: '101275-5239',
	} as const;

	const dataCompany = {
		value: ktCompany as KennitalaCompany,
		type: 'company',
		robot: false,
		formatted: '500101-2880',
	} as const;

	const dataGervi = {
		value: ktGervi as KennitalaPerson,
		type: 'person',
		robot: true,
		formatted: '010130-7789',
	} as const;

	o('parses simple kennitala', () => {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const either = parseKennitala(ktPerson);
		if (either) {
			type v = Expect<Equals<typeof either.value, Kennitala>>;
			type t = Expect<Equals<typeof either.type, KennitalaType>>;
			type r = Expect<Equals<typeof either.robot, false>>;
			if (either.type === 'person') {
				type v = Expect<Equals<typeof either.value, KennitalaPerson>>;
			}
			if (either.type === 'company') {
				type v = Expect<Equals<typeof either.value, KennitalaCompany>>;
			}
		}
		const eitherRobot = parseKennitala(ktPerson, { robot: true });
		if (eitherRobot) {
			type v = Expect<Equals<typeof eitherRobot.value, Kennitala>>;
			type t = Expect<Equals<typeof eitherRobot.type, KennitalaType>>;
			type r = Expect<Equals<typeof eitherRobot.robot, boolean>>;
			if (eitherRobot.type === 'company') {
				type v = Expect<Equals<typeof eitherRobot.robot, false>>;
			}
		}
		const person = parseKennitala(ktPerson, { type: 'person' });
		if (person) {
			type v = Expect<Equals<typeof person.value, KennitalaPerson>>;
			type t = Expect<Equals<typeof person.type, 'person'>>;
			type r = Expect<Equals<typeof person.robot, false>>;
		}
		const company = parseKennitala(ktPerson, { type: 'company', clean: 'careful' });
		if (company) {
			type v = Expect<Equals<typeof company.value, KennitalaCompany>>;
			type t = Expect<Equals<typeof company.type, 'company'>>;
			type r = Expect<Equals<typeof company.robot, false>>;
		}

		const alwaysPerson = parseKennitala(ktPerson as KennitalaPerson);
		type v = Expect<Equals<typeof alwaysPerson, KennitalaDataPerson | undefined>>;
		const alwaysPerson2 = parseKennitala(ktPerson as KennitalaPerson, { robot: true });
		type v2 = Expect<Equals<typeof alwaysPerson2, KennitalaDataPerson<boolean>>>;
		const alwaysCompany = parseKennitala(ktCompany as KennitalaCompany);
		type v3 = Expect<Equals<typeof alwaysCompany, KennitalaDataCompany>>;
		/* eslint-enable @typescript-eslint/no-unused-vars */

		satisfies(parseKennitala(ktPerson), dataPerson);
		satisfies(parseKennitala(ktCompany), dataCompany);
		o(parseKennitala(ktGervi)).equals(undefined);
		o(parseKennitala(ktInvalid1)).equals(undefined);
		o(parseKennitala(ktInvalid2)).equals(undefined);
	});

	o('Treats empty (and falsy) input as invalid', () => {
		o(parseKennitala('')).equals(undefined);
		// @ts-expect-error  (testing invalid input)
		const bogusInput1: string = undefined;
		o(parseKennitala(bogusInput1)).equals(undefined);
		// @ts-expect-error  (testing invalid input)
		const bogusInput2: string = false;
		o(parseKennitala(bogusInput2)).equals(undefined);
	});

	o('Accepts kennitalas with predictable spaces and dashes', () => {
		satisfies(parseKennitala(kt_Person1), dataPerson);
		satisfies(parseKennitala(kt_Person1, { clean: 'careful' }), dataPerson);
		satisfies(parseKennitala(kt_Person1_EnDash), dataPerson);
		satisfies(parseKennitala(kt_Company), dataCompany);
		satisfies(parseKennitala(kt_Company2), dataCompany);
	});

	o('Accepts kennitalas with predictable spaces and dashes', () => {
		satisfies(parseKennitala(kt_Person1), dataPerson);
		satisfies(parseKennitala(kt_Person1_EnDash), dataPerson);
		satisfies(parseKennitala(kt_Company), dataCompany);
		satisfies(parseKennitala(kt_Company2), dataCompany);
	});

	o('Optionally distinguishes between persons and companies', () => {
		satisfies(parseKennitala(ktPerson, { type: 'person' }), dataPerson);
		o(parseKennitala(ktPerson, { type: 'company' })).equals(undefined);
		satisfies(parseKennitala(ktCompany, { type: 'company' }), dataCompany);
		o(parseKennitala(ktCompany, { type: 'person' })).equals(undefined);
	});

	o('Invalid `type` flags are ignored', () => {
		// @ts-expect-error  (testing invalid input)
		const bogusType: KennitalaType = 'foo';
		satisfies(parseKennitala(ktPerson, { type: bogusType }), dataPerson);
		satisfies(parseKennitala(ktCompany, { type: bogusType }), dataCompany);
	});

	o('Optionally allows Gervimaður', () => {
		satisfies(parseKennitala(ktGervi, { robot: true }), dataGervi);
		o(parseKennitala(ktGervi, { robot: false })).equals(undefined);
		// robot flag has no effect on other functions
		satisfies(parseKennitala(ktPerson, { robot: true }), dataPerson);
		satisfies(parseKennitala(ktPerson, { robot: true, type: 'person' }), dataPerson);
		o(parseKennitala(ktPerson, { robot: true, type: 'company' })).equals(undefined);
	});
});

// ---------------------------------------------------------------------------

o.spec('isValidKennitala', () => {
	o('Validates simple kennitalas', () => {
		o(isValidKennitala(ktPerson)).equals(true);
		o(isValidKennitala(ktCompany)).equals(true);
		o(isValidKennitala(ktGervi)).equals(false);
		o(isValidKennitala(ktInvalid1)).equals(false);
		o(isValidKennitala(ktInvalid2)).equals(false);
	});

	o('Treats empty (and falsy) input as invalid', () => {
		o(isValidKennitala('')).equals(false);
		// @ts-expect-error  (testing invalid input)
		o(isValidKennitala(undefined)).equals(false);
		// @ts-expect-error  (testing invalid input)
		o(isValidKennitala(false)).equals(false);
	});

	o('Performs no cleanup by default', () => {
		o(isValidKennitala(kt_Person1)).equals(false);
		o(isValidKennitala(kt_Person1_EnDash)).equals(false);
		o(isValidKennitala(kt_Company)).equals(false);
		o(isValidKennitala(kt_Company2)).equals(false);
	});

	o('Opionally performs careful cleanup', () => {
		o(isValidKennitala(kt_Person1, { clean: 'careful' })).equals(true);
		o(isValidKennitala(kt_Person1_EnDash, { clean: 'careful' })).equals(true);
		o(isValidKennitala(kt_Company, { clean: 'careful' })).equals(true);
		o(isValidKennitala(kt_Company2, { clean: 'careful' })).equals(true);
	});

	o('Accepts malformed kennitals with aggressive clean option', () => {
		o(isValidKennitala(kt_Malformed1)).equals(false);
		o(isValidKennitala(kt_Malformed1, { clean: 'aggressive' })).equals(true);
		o(isValidKennitala(`(kt. ${kt_Person1})`, { clean: 'aggressive' })).equals(true);
		o(isValidKennitala(`(kt. ${kt_Person1} blöö)`, { clean: 'aggressive' })).equals(true);
		o(
			isValidKennitala(`(kt. ${kt_Person1}${kt_Person1})`, {
				clean: 'aggressive',
			})
		).equals(false);
		o(
			isValidKennitala(`(kt. ${kt_Person1} - s. 765 4321)`, {
				clean: 'aggressive',
			})
		).equals(false);
		o(isValidKennitala(kt_Malformed2_EmDash, { clean: 'aggressive' })).equals(false)(
			'em-dash is not accepted'
		);
	});

	o('Optionally distinguishes between persons and companies', () => {
		o(isValidKennitala(ktPerson, { type: 'person' })).equals(true);
		o(isValidKennitala(ktPerson, { type: 'company' })).equals(false);
		o(isValidKennitala(ktCompany, { type: 'person' })).equals(false);
		o(isValidKennitala(ktCompany, { type: 'company' })).equals(true);
	});

	o('Invalid `type` flags are ignored', () => {
		// @ts-expect-error  (testing invalid input)
		const bogusType: KennitalaType = 'foo';
		o(isValidKennitala(ktPerson, { type: bogusType })).equals(true);
		o(isValidKennitala(ktCompany, { type: bogusType })).equals(true);
	});

	o('Optionally allows Gervimaður', () => {
		o(isValidKennitala(ktGervi, { robot: true })).equals(true);
		o(isValidKennitala(ktGervi, { robot: false })).equals(false);
		// robot flag has no effect on other functions
		o(isValidKennitala(ktPerson, { robot: true })).equals(true);
		o(isValidKennitala(ktPerson, { robot: true, type: 'person' })).equals(true);
		o(isValidKennitala(ktPerson, { robot: true, type: 'company' })).equals(false);
	});
});

// ---------------------------------------------------------------------------

o.spec('isPersonKennitala and isCompanyKennitala', () => {
	o('Correctly detects type of valid Kennitalas', () => {
		o(isPersonKennitala(ktPerson as Kennitala)).equals(true);
		o(isCompanyKennitala(ktCompany as Kennitala)).equals(true);
		o(isPersonKennitala(ktCompany as Kennitala)).equals(false);
		o(isCompanyKennitala(ktPerson as Kennitala)).equals(false);
	});

	o('Performs no trimming/parsing/validation on invalid strings', () => {
		// @ts-expect-error  (testing invalid input)
		const startsWith2: Kennitala = '2foobar';
		// @ts-expect-error  (testing invalid input)
		const startsWith9: Kennitala = '9foobar';
		// @ts-expect-error  (testing invalid input)
		const someWord: Kennitala = 'foobar';
		// @ts-expect-error  (testing invalid input)
		const spacedKtPerson: Kennitala = ' ' + ktPerson;
		// @ts-expect-error  (testing invalid input)
		const spacedKtCompany: Kennitala = ' ' + ktCompany;

		o(isPersonKennitala(startsWith2)).equals(true)('isPerson `startsWith2`');
		o(isPersonKennitala(startsWith9)).equals(false)('isPerson `startsWith9`');
		o(isPersonKennitala(someWord)).equals(false)('isPerson `someWord`');
		o(isPersonKennitala(spacedKtPerson)).equals(false)('isPerson `spacedKtPerson`');

		o(isCompanyKennitala(startsWith9)).equals(true)('isCompany `startsWith9`');
		o(isCompanyKennitala(startsWith2)).equals(false)('isCompany `startsWith2`');
		o(isCompanyKennitala(someWord)).equals(false)('isCompany `someWord`');
		o(isCompanyKennitala(spacedKtCompany)).equals(false)('isCompany `spacedKtPerson`');
	});

	if (false as boolean) {
		const ktTest = '' as Kennitala;
		if (isPersonKennitala(ktTest)) {
			type v = Expect<Equals<typeof ktTest, KennitalaPerson>>;
		}
		if (isCompanyKennitala(ktTest)) {
			type v = Expect<Equals<typeof ktTest, KennitalaCompany>>;
		}
	}
});

// ---------------------------------------------------------------------------

o.spec('cleanKennitalaCareful', () => {
	o('Exposes (careful) clean function', () => {
		o(cleanKennitalaCareful(' 123456-7890')).equals('1234567890');
		o(cleanKennitalaCareful('123456 7890 ')).equals('1234567890');
		o(cleanKennitalaCareful(' 123456 - 7890')).equals('1234567890');
		o(cleanKennitalaCareful('123456 -7890')).equals('1234567890');
		// Too much internal spacing
		o(cleanKennitalaCareful(kt_Malformed3)).equals(kt_Malformed3);
		// trims only
		o(cleanKennitalaCareful(' abc ')).equals('abc');
		o(cleanKennitalaCareful('kt. 123456-7890')).equals('kt. 123456-7890');
		o(cleanKennitalaCareful(' 1234-567890')).equals('1234-567890');
		o(cleanKennitalaCareful('123 456-7890')).equals('123 456-7890');
		o(cleanKennitalaCareful(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash);
	});
});

// ---------------------------------------------------------------------------

o.spec('cleanKennitalaAggressive', () => {
	o('Exposes aggressive clean function', () => {
		o(cleanKennitalaAggressive(' 123456-7890')).equals('1234567890');
		o(cleanKennitalaAggressive('123456 7890 ')).equals('1234567890');
		o(cleanKennitalaAggressive(' 123456 - 7890')).equals('1234567890');
		o(cleanKennitalaAggressive('123456 -7890')).equals('1234567890');

		o(cleanKennitalaAggressive(' 12 34 56 - 78 90')).equals('1234567890');
		o(cleanKennitalaAggressive('1-2-3 4-5 6-7-8 9-0')).equals('1234567890');

		o(cleanKennitalaAggressive('(kt. 123456-7890)')).equals('1234567890');
		o(cleanKennitalaAggressive('(s. 765 4321) ')).equals('7654321')(
			'does not check for length'
		);
		o(cleanKennitalaAggressive('(kt. 123456-7890, s. 765 4321) ')).equals(
			'1234567890,s.7654321'
		)('does not clean non-digits in the middle of the string');
		o(cleanKennitalaAggressive(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash)(
			'em-dashes are not accepted'
		);
	});
});

// ---------------------------------------------------------------------------

o.spec('formatKennitala', () => {
	o('Exposes a simple formatter', () => {
		o(formatKennitala('101275-5239 ')).equals('101275-5239');
		o(formatKennitala('1012755239')).equals('101275-5239');
		o(formatKennitala(' 5001012880 ')).equals('500101-2880');
		o(formatKennitala('500101 - 2880')).equals('500101-2880');
		o(formatKennitala(' 010130 7789')).equals('010130-7789');
		o(formatKennitala(kt_Malformed1)).equals(kt_Malformed1);
		o(formatKennitala(kt_Malformed2)).equals(kt_Malformed2);
		o(formatKennitala(kt_Malformed2_EmDash)).equals(kt_Malformed2_EmDash);
	});
});

// ---------------------------------------------------------------------------

o.spec('getKennitalaBirthDate', () => {
	o('Exposes a birthdate function', () => {
		const p1BDay = getKennitalaBirthDate(ktPerson);
		o(p1BDay?.toISOString().substring(0, 10)).equals('1975-12-10');
		const p2BDay = getKennitalaBirthDate(kt_Person1);
		o(p2BDay?.toISOString().substring(0, 10)).equals('1975-12-10');
		const cBDay = getKennitalaBirthDate(kt_Company);
		o(cBDay?.toISOString().substring(0, 10)).equals('2001-01-10');
		const iBDay = getKennitalaBirthDate(ktInvalid1);
		o(iBDay?.toISOString().substring(0, 10)).equals('2065-12-12')(
			'Kennitalas are not validated'
		);
		const i2BDay = getKennitalaBirthDate(kt_Malformed1);
		o(i2BDay).equals(undefined)('Malformed digit-strings return undefined');
		const i3BDay = getKennitalaBirthDate('bogus');
		o(i3BDay).equals(undefined)('Bogus strings return undefined');
	});
});
