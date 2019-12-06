import o from 'ospec';
import validCreditcard from './validCreditcard';

o.spec('validCreditcard', () => {
	const ccValid = '5587402000012037';
	const ccValidTesting = '1234123412341238';
	const ccInvalid1 = '2435678943654332';
	const ccInvalid2 = '10127552';

	const cc_Valid1 = '5587-4020-0001-2037';
	const cc_Valid2 = ' 5587 402 00 001-2037';
	const cc_Invalid1 = '2435-6789-4365-4332';
	const cc_Invalid2 = '101 2-7  552';

	o('Validates simple creditcard numbers', () => {
		o(validCreditcard(ccValid)).equals(true);
		o(validCreditcard(ccValidTesting)).equals(true);
		o(validCreditcard(ccInvalid1)).equals(false);
		o(validCreditcard(ccInvalid2)).equals(false);
	});

	o('Tolerates spaces and dashes in creditcard numbers', () => {
		o(validCreditcard(cc_Valid1)).equals(true);
		o(validCreditcard(cc_Valid2)).equals(true);
		o(validCreditcard(cc_Invalid1)).equals(false);
		o(validCreditcard(cc_Invalid2)).equals(false);
	});

	o('Treats empty (and falsy) input as "valid"', () => {
		o(validCreditcard('')).equals(true);

		// @ts-ignore  (testing invalid input)
		o(validCreditcard(undefined)).equals(true);
		// @ts-ignore  (testing invalid input)
		o(validCreditcard(false)).equals(true);
	});

	o('Exposes clean function', () => {
		o(validCreditcard.clean(ccValid)).equals(ccValid);
		o(validCreditcard.clean(ccInvalid2)).equals(ccInvalid2);
		o(validCreditcard.clean(cc_Valid1)).equals(ccValid);
		o(validCreditcard.clean(cc_Valid2)).equals(ccValid);
		o(validCreditcard.clean(cc_Invalid1)).equals(ccInvalid1);
		o(validCreditcard.clean(cc_Invalid2)).equals(ccInvalid2);
	});
});
