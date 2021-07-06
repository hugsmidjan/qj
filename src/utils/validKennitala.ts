declare const _KennitalaPerson__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person */
export type KennitalaPerson = string & { [_KennitalaPerson__Brand]: true };

declare const _KennitalaCompany__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person */
export type KennitalaCompany = string & { [_KennitalaCompany__Brand]: true };

/** A valid 10-digit Kennitala string for either a person or a compnay */
export type KennitalaReal = KennitalaCompany | KennitalaPerson;

declare const _KennitalaRobot__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a "Gervimaður" */
export type KennitalaRobot = string & { [_KennitalaRobot__Brand]: true };

/** A valid 10-digit Kennitala string */
export type Kennitala = KennitalaReal | KennitalaRobot;

// ---------------------------------------------------------------------------

type KtType = 'einst' | 'fyrirt';

const carefulClean = (kt: string): string =>
	kt.trim().replace(/^(\d{6})\s*-?\s*(\d{4})$/, '$1$2');

const aggressiveClean = (kt: string): string =>
	kt.replace(/^\D+/, '').replace(/\D+$/, '').replace(/[\s-]/g, '');

const magic = [3, 2, 7, 6, 5, 4, 3, 2, 1];

function validKennitala(
	/** A reasonably kennitala-ish string
	 *
	 * Automatically trims the string and strips away spaces and dashes.
	 */
	kt: string,
	opts: {
		/** If the valdation should specifically check for a
		 * private person, or a legal entity kennitala.
		 *
		 * Defaults to validating both types.
		 */
		type?: KtType;
		/** Should the validation accept a "robot" kennitalas also
		 *
		 * Defaults to rejecting "robot"s.
		 */
		robot?: boolean;
		/** Aggressive mode strips away all spaces and dashes and throws away any leading and trailing gunk
		 *
		 * Careful mode (default) performs only minimal cleaning on the incoming string
		 * ...trimming and then only removing space and/or dash before the last four digits of a 10-digit string.
		 */
		clean?: 'aggressive' | 'careful';
	} = {}
): boolean {
	kt = kt && (opts.clean === 'aggressive' ? aggressiveClean(kt) : carefulClean(kt));
	if (kt) {
		if (
			!/^[0-7]\d{8}[90]$/.test(kt) ||
			(!opts.robot &&
				/010130(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(kt)) // Robot check
		) {
			return false;
		}
		const checkSum = magic.reduce((acc, num, i) => acc + num * parseInt(kt[i]), 0);
		if (checkSum % 11) {
			return false;
		}
		if (opts.type) {
			if (
				(opts.type === 'einst' && kt[0] > '3') ||
				(opts.type === 'fyrirt' && kt[0] < '4')
			) {
				return false;
			}
		}
	}
	return true;
}

/** Trims the string and then carefully only removes spaces and/or a dash
 * before the last four digits of a 10-digit string.
 *
 * Defaults to returning the original string if the pattern doesn't match
 *
 * Cleaned:
 *  * `' 123456-7890'` ==> `'1234567890'`
 *  * `'123456 7890 '` ==> `'1234567890'`
 *  * `' 123456 - 7890'` ==> `'1234567890'`
 *  * `'123456 -7890'` ==> `'1234567890'`
 *
 * Only trimmed:
 * 	* `' abc '` ==> `'abc'`
 * 	* `'kt. 123456-7890'` ==> `'kt. 123456-7890'`
 * 	* `' 1234-567890'` ==> `'1234-567890'`
 * 	* `'123 456-7890'` ==> `'123 456-7890'`
 */
validKennitala.clean = carefulClean;

/** Aggressively strips away all spaces and dashes from the string,
 * as well as any trailing and leading non-digit gunk.
 *
 * Examples:
 *  * `'(kt. 123456-7890)'` ==> `'1234567890'`
 *  * `'(kt. 123456-7890, s. 765 4321) '` ==> `'1234567890,s.7654321'`
 *  * `'(s. 765 4321) '` ==> `'7654321'`
 *  * `' 12 34 56 - 78 90'` ==> `'1234567890'`
 *  * `'1-2-3 4-5 6-7-8 9-0'` ==> `'1234567890'`
 *  * `' abc '` ==> `''`
 */
validKennitala.cleanAggressive = aggressiveClean;

const cleanIfKtShaped = (str: string) => {
	const kt = carefulClean(str);
	return kt.length === 10 && !/\D/.test(kt) ? kt : undefined;
};

/** Runs careful cleanup on the input string and if it looks like a kennitala
 * then inserts a nice '-' before the last four digits.
 *
 * Defaults to returning the input untouched.
 */
validKennitala.format = (ktShaped: string) => {
	const kt = cleanIfKtShaped(ktShaped);
	if (!kt) {
		return ktShaped;
	}
	return kt.substr(0, 6) + '-' + kt.substr(6);
};

/** Returns an birthday (UTC) for a "kennitala-shaped" string
 * ...without checking if it is a valid kennitala.
 *
 * For out-shaped strings it returns undefined.
 */
validKennitala.getBirthday = (ktShaped: string) => {
	const kt = cleanIfKtShaped(ktShaped);
	if (!kt) {
		return undefined;
	}
	const MM = kt.substr(2, 2);
	const CC = kt.substr(9, 1) === '9' ? '19' : '20';
	const YY = kt.substr(4, 2);
	const birthDate = new Date(`${CC}${YY}-${MM}-01`);
	let date = parseInt(kt.substr(0, 2));
	if (date > 31) {
		date = date - 40;
	}
	birthDate.setUTCDate(date);
	return birthDate;
};

export default validKennitala;
