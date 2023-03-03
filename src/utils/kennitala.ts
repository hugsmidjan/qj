declare const _KennitalaPerson__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person */
export type KennitalaPerson = string & { [_KennitalaPerson__Brand]: true };

declare const _KennitalaCompany__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person */
export type KennitalaCompany = string & { [_KennitalaCompany__Brand]: true };

/** A valid 10-digit Kennitala string */
export type Kennitala = KennitalaPerson | KennitalaCompany;

// ---------------------------------------------------------------------------

export type KennitalaType = 'person' | 'company';

// ---------------------------------------------------------------------------

/**
 * Trims the string and then only removes spaces and/or a dash (or en-dash)
 * before the last four of the ten digits.
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
 *  * `' 123456   - 7890'` ==> `'123456   - 7890'`
 * 	* `'kt. 123456-7890'` ==> `'kt. 123456-7890'`
 * 	* `' 1234-567890'` ==> `'1234-567890'`
 * 	* `'123 456-7890'` ==> `'123 456-7890'`
 */
export const cleanKennitalaCareful = (kt: string): string =>
	kt.trim().replace(/^(\d{6})\s?[-–]?\s?(\d{4})$/, '$1$2');

// ---------------------------------------------------------------------------

/**
 * Aggressively strips away all spaces and dashes (or en-dashes) from the string,
 * as well as any trailing and leading non-digit gunk.
 *
 * Examples:
 *  * `'(kt. 123456-7890)'` ==> `'1234567890'`
 *  * `'(kt. 123456-7890, s. 765 4321) '` ==> `'1234567890,s.7654321'`
 *  * `'(tel. 123-4567, 765-4321)'` ==> `'1234567,7654321'`
 *  * `'(s. 765 4321) '` ==> `'7654321'`
 *  * `' 12 34 56 - 78 90'` ==> `'1234567890'`
 *  * `'1-2-3 4-5 6-7-8 9-0'` ==> `'1234567890'`
 *  * `' abc '` ==> `''`
 */
export const cleanKennitalaAggressive = (kt: string): string =>
	kt
		.replace(/^\D+/, '')
		.replace(/\D+$/, '')
		.replace(/[\s-–]/g, '');

// ---------------------------------------------------------------------------

const cleanIfKtShaped = (str: string) => {
	const kt = cleanKennitalaCareful(str);
	return kt.length === 10 && !/\D/.test(kt) ? kt : undefined;
};

/**
 * Runs minimal cleanup on the input string and if it looks like a kennitala
 * then then inserts a nice '-' before the last four digits.
 *
 * Defaults to returning the input untouched.
 */
export const formatKennitala = (ktShaped: string) => {
	const kt = cleanIfKtShaped(ktShaped);
	if (!kt) {
		return ktShaped;
	}
	return kt.substring(0, 6) + '-' + kt.substring(6);
};

// ---------------------------------------------------------------------------

type KennitalaOptions<
	KtType extends KennitalaType | undefined = KennitalaType,
	PossiblyRobot extends boolean = boolean
> = {
	/**
	 * If the valdation should specifically check for a
	 * private person, or a legal entity ("company") kennitala.
	 *
	 * Defaults to accepting both types.
	 */
	type?: KtType;
	/**
	 * Set this flag to `true` if the parser should accept known
	 * "Gervimaður" kennitalas (commonly used for mocking or systems-testing).
	 *
	 * Defaults to `false`.
	 */
	robot?: PossiblyRobot;
	/**
	 * `"aggressive"` mode strips away all spaces and dashes and throws away any
	 * leading/trailing gunk.
	 *
	 * `false`/`"none"` performs no cleanup whatsoever, not even trimming.
	 *
	 * Default is `"careful"` mode, which performs only minimal cleaning on the
	 * incoming string ...trimming it and then removing a space and/or dash
	 * right before the last four of the ten digits.
	 */
	clean?: 'aggressive' | 'careful' | 'none' | false;
};

export type KennitalaDataPerson<PossiblyRobot extends boolean = false> = {
	/** The plain, cleaned-up 10 digit kennitala string */
	value: KennitalaPerson;
	/** The type of kennitala  */
	type: 'person';
	/** Indicates if the kennitala is a "Gervimaður" — i.e. a fake/testing kennitala */
	robot: PossiblyRobot extends false ? false : boolean;
	/** Pretty-formatted version of the kennitala with a dash before the last four digits */
	formatted: string;
	toString(): string;
};

export type KennitalaDataCompany = {
	/** The plain, cleaned-up 10 digit kennitala string */
	value: KennitalaCompany;
	/** The type of kennitala  */
	type: 'company';
	/** Indicates if the kennitala is a "Gervimaður" — i.e. a fake/testing kennitala */
	robot: false;
	/** Pretty-formatted version of the kennitala with a dash before the last four digits */
	formatted: string;
	toString(): string;
};

export type KennitalaData<
	KtType extends KennitalaType = KennitalaType,
	PossiblyRobot extends boolean = boolean
> = (KennitalaDataPerson<PossiblyRobot> | KennitalaDataCompany) & { type: KtType };

const magic = [3, 2, 7, 6, 5, 4, 3, 2, 1];
const robotKtRe = /010130(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/;
const validTypes: Record<KennitalaType, 1> = { person: 1, company: 1 };

/**
 * Parses a string value to see if may be a technically valid kennitala,
 * and if so, it returns a data object with the cleaned up value
 * along with some meta-data and pretty-formatted version.
 *
 * If the parsing/validation fails, it simply returns `undefined`
 */
export function parseKennitala(
	// This is here just to trick TS into providing full IntelliSense
	// auto-complete for `KennitalaOptions.type` values. Ack!
	kt: '',
	opt?: KennitalaOptions
): undefined;

export function parseKennitala(
	kt: KennitalaCompany,
	opt?: KennitalaOptions<'company'>
): KennitalaDataCompany;

export function parseKennitala<PossiblyRobot extends boolean = false>(
	kt: KennitalaPerson,
	opt?: KennitalaOptions<'person', PossiblyRobot>
): PossiblyRobot extends false
	? undefined | KennitalaDataPerson
	: KennitalaDataPerson<boolean>;

export function parseKennitala<
	KtType extends KennitalaType,
	PossiblyRobot extends boolean = false
>(
	value: string,
	opts?: KennitalaOptions<KtType, PossiblyRobot>
): KennitalaData<KtType, PossiblyRobot> | undefined;

export function parseKennitala<
	KtType extends KennitalaType,
	PossiblyRobot extends boolean = true
>(
	value: string,
	opts?: KennitalaOptions<KtType, PossiblyRobot>
): KennitalaData<KtType, PossiblyRobot> | undefined {
	opts = opts || {};
	if (!value) {
		return;
	}
	value =
		opts.clean === 'none' || opts.clean === false
			? value
			: opts.clean === 'aggressive'
			? cleanKennitalaAggressive(value)
			: cleanKennitalaCareful(value);

	if (value.length !== 10 || !/^[0-7]\d{8}[90]$/.test(value)) {
		return;
	}
	const robot = robotKtRe.test(value);
	if (robot && !opts.robot) {
		return;
	}
	const checkSum = magic.reduce((acc, num, i) => acc + num * parseInt(value[i]), 0);
	if (checkSum % 11) {
		return;
	}
	const type: KennitalaType = value[0] > '3' ? 'company' : 'person';
	const optType = opts.type;
	if (optType && optType in validTypes && optType !== type) {
		return;
	}

	return {
		value,
		type,
		robot,
		toString: () => value,
		get formatted() {
			return formatKennitala(value);
		},
	} as KennitalaData<KtType, PossiblyRobot>;
}

// ---------------------------------------------------------------------------

/**
 * Options are the same as for `parseKennitala` except that `clean` defaults to `"none"`
 */
export const isValidKennitala = (kt: string, opts?: KennitalaOptions): kt is Kennitala =>
	!!parseKennitala(kt, {
		...opts,
		// make "clean: false" the default when validating
		clean: opts?.clean || false,
	});

// ---------------------------------------------------------------------------

/**
 * Returns the (UTC) birth-date (or founding-date) of a "kennitala-shaped" string
 * ...without checking if it is a valid kennitala.
 *
 * For malformed (non-kennitala shaped) strings it returns undefined.
 */
export const getKennitalaBirthDate = (ktShaped: string) => {
	const kt = cleanIfKtShaped(ktShaped);
	if (!kt) {
		return;
	}
	const MM = kt.substring(2, 4);
	const CC = kt.substring(9, 10) === '9' ? '19' : '20';
	const YY = kt.substring(4, 6);
	const birthDate = new Date(`${CC + YY}-${MM}-01`);
	let date = parseInt(kt.substring(0, 2));
	if (date > 31) {
		date = date - 40;
	}
	birthDate.setUTCDate(date);
	return birthDate;
};

// ---------------------------------------------------------------------------

/**
 * Detects if an input `Kennitala` is `KennitalaPerson`.
 *
 * Assumes that the input `kt` is already validated as `Kennitala`
 * and performs no internal validation, and is thus unreliable
 * for random strings.
 */
export const isPersonKennitala = (kt: Kennitala): kt is KennitalaPerson =>
	parseInt(kt[0]) <= 3;

/**
 * Detects if an input `Kennitala` is `KennitalaCompany`
 *
 * Assumes that the input `kt` is already validated as `Kennitala`
 * and performs no internal validation, and is thus unreliable
 * for random strings.
 */
export const isCompanyKennitala = (kt: Kennitala): kt is KennitalaCompany =>
	parseInt(kt[0]) >= 4;
