import o from 'ospec';
import validKennitala from './validKennitala';

o.spec('validKenntitala', () => {
	const ktPerson = '1012755239';
	const ktCompany = '5001012880';
	const ktGervi = '0101307789';
	const ktInvalid1 = '1234567890';
	const ktInvalid2 = '10127552';

	const kt_Person1 = '101275-5239';
	const kt_Person2 = ' 10-1275-52 39';
	const kt_Company = '500101 2880';
	const kt_Gervi = '010130-7789';
	const kt_Invalid2 = ' 101275-52';

	o('Validates simple kennitalas', () => {
		o(validKennitala(ktPerson)).equals(true);
		o(validKennitala(ktCompany)).equals(true);
		o(validKennitala(ktGervi)).equals(false);
		o(validKennitala(ktInvalid1)).equals(false);
		o(validKennitala(ktInvalid2)).equals(false);
	});

	o('Treats empty (and falsy) input as "valid"', () => {
		o(validKennitala('')).equals(true);

		// @ts-ignore  (testing invalid input)
		o(validKennitala(undefined)).equals(true);
		// @ts-ignore  (testing invalid input)
		o(validKennitala(false)).equals(true);
	});

	o('Accepts kennitalas with spaces and dashes', () => {
		o(validKennitala(kt_Person1)).equals(true);
		o(validKennitala(kt_Person2)).equals(true);
		o(validKennitala(kt_Company)).equals(true);
		o(validKennitala(kt_Gervi)).equals(false);
	});

	o('Optionally distinguishes between persons and companies', () => {
		o(validKennitala(ktPerson, { type: 'einst' })).equals(true);
		o(validKennitala(ktPerson, { type: 'fyrirt' })).equals(false);
		o(validKennitala(ktCompany, { type: 'einst' })).equals(false);
		o(validKennitala(ktCompany, { type: 'fyrirt' })).equals(true);
	});

	o('Invalid `type` flags are ignored', () => {
		// @ts-ignore  (testing invalid input)
		o(validKennitala(ktPerson, { type: 'foo' })).equals(true);
		// @ts-ignore  (testing invalid input)
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

	o('Exposes clean function', () => {
		o(validKennitala.clean(ktPerson)).equals(ktPerson);
		o(validKennitala.clean(ktInvalid2)).equals(ktInvalid2);
		o(validKennitala.clean(kt_Person1)).equals(ktPerson);
		o(validKennitala.clean(kt_Person2)).equals(ktPerson);
		o(validKennitala.clean(kt_Company)).equals(ktCompany);
		o(validKennitala.clean(kt_Gervi)).equals(ktGervi);
		o(validKennitala.clean(kt_Invalid2)).equals(ktInvalid2);
	});
});
