declare const _KennitalaPerson__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person */
export type KennitalaPerson = string & { [_KennitalaPerson__Brand]: true };

declare const _KennitalaCompany__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person */
export type KennitalaCompany = string & { [_KennitalaCompany__Brand]: true };

/** A valid 10-digit Kennitala string */
export type Kennitala = KennitalaPerson | KennitalaCompany;

declare const _KennitalaTemporary__Brand: unique symbol;
/** A valid 10-digit Kennitala string for a person with a temporary "Kerfiskennitala" */
export type KennitalaTemporary = KennitalaPerson & { [_KennitalaTemporary__Brand]: true };

// ---------------------------------------------------------------------------

export type KennitalaType = 'person' | 'company';

// ---------------------------------------------------------------------------

/**
 * Trims the string and then only removes spaces and/or a dash (or en-dash)
 * before the last four of the ten digits.
 *
 * Defaults to returning the (trimmed) original string, if the pattern
 * doesn't match.
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
export const cleanKennitalaCareful = (value: string): string =>
  value.trim().replace(/^(\d{6})\s?[-–]?\s?(\d{4})$/, '$1$2');

// ---------------------------------------------------------------------------

/**
 * Aggressively strips away all spaces and dashes (or en-dashes) from the string,
 * as well as any trailing and leading non-digit gunk.
 *
 * Returns whatever is left.
 *
 * Examples:
 *  * `' abc '` ==> `''`
 *  * `'(kt. 123456-7890)'` ==> `'1234567890'`
 *  * `'(kt. 123456-7890, s. 765 4321) '` ==> `'1234567890,s.7654321'`
 *  * `'(tel. 123-4567, 765-4321)'` ==> `'1234567,7654321'`
 *  * `'(s. 765 4321) '` ==> `'7654321'`
 *  * `' 12 34 56 - 78 90'` ==> `'1234567890'`
 *  * `'1-2-3 4-5 6-7-8 9-0'` ==> `'1234567890'`
 */
export const cleanKennitalaAggressive = (value: string): string =>
  value
    .replace(/^\D+/, '')
    .replace(/\D+$/, '')
    .replace(/[\s-–]/g, '');

// ---------------------------------------------------------------------------

const cleanIfKtShaped = (value: string) => {
  const cleaned = cleanKennitalaCareful(value);
  return cleaned.length === 10 && !/\D/.test(cleaned) ? cleaned : undefined;
};

/**
 * Runs minimal cleanup on the input string and if it looks like a kennitala
 * then then inserts a nice '-' before the last four digits.
 *
 * Defaults to returning the input untouched.
 */
export const formatKennitala = (value: string) => {
  const cleaned = cleanIfKtShaped(value);
  if (!cleaned) {
    return value;
  }
  return cleaned.substring(0, 6) + '-' + cleaned.substring(6);
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
   * Set this flag to `true` to reject short-term temporary kennitalas
   * (Kerfiskennitala) given to short-stay (or no-stay) individuals/workers.
   *
   * Defaults to `false`
   *
   * BTW, Rationale for the "on by default" behavior:
   * - These are kennitalas of actual people, not some fake "Gervimaður".
   * - "Kerfiskennitala"s are, by definition, perfectly **valid** kennitalas.
   * - This is a simple helper library, whose purpose is only to catch obvious
   *   mistakes and show error messages fast.
   * - Any real stakes filtering (including for age) should/must occur
   *   in the next step anyway.
   */
  rejectTemporary?: boolean;
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
  /** Indicates if the kennitala is a temporary "Kerfiskennitala" */
  temporary?: true;
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
  /** Indicates if the kennitala is a temporary "Kerfiskennitala" */
  temporary?: never;
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

const toKtData = (data: {
  value: string;
  type: KennitalaType;
  robot: boolean;
  temporary?: true;
}) => {
  const { value, type, robot, temporary } = data;
  return {
    value,
    type,
    robot,
    temporary,
    toString: () => value,
    get formatted() {
      return formatKennitala(value);
    },
  };
};

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
  value: '',
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

// eslint-disable-next-line complexity
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

  if (value.length !== 10 || /\D/.test(value)) {
    return;
  }
  if (/^[89]/.test(value) && !opts.rejectTemporary && opts.type !== 'company') {
    /*
      Skráning á kerfiskennitöluskrá er eingöngu fyrir einstaklinga sem
      dvelja skemur en 3-6 mánuði á Íslandi eða munu ekki dvelja hér á landi.
      [Þær] samanstanda af tíu tölustöfum og byrja ávallt á 8 eða 9
      og hinar tölurnar verða tilviljanakenndar.
      https://www.skra.is/folk/eg-i-thjodskra/um-kennitolur/um-kerfiskennitolur/
    */
    return toKtData({
      value,
      type: 'person',
      robot: false,
      temporary: true,
    }) as KennitalaData<KtType, PossiblyRobot>;
  }

  if (!/^[0-7].+[890]$/.test(value)) {
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

  return toKtData({ value, type, robot }) as KennitalaData<KtType, PossiblyRobot>;
}

// ---------------------------------------------------------------------------

/**
 * Runs the input through `parseKennitala` and returns `true` if the parsing
 * was successful.
 *
 * Options are the same as for `parseKennitala` except that `clean` option
 * defaults to `"none"`.
 */
export const isValidKennitala = (
  value: string,
  opts?: KennitalaOptions
): value is Kennitala =>
  !!parseKennitala(value, {
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
export const getKennitalaBirthDate = (value: string) => {
  const cleaned = cleanIfKtShaped(value);
  if (!cleaned) {
    return;
  }
  const MM = cleaned.substring(2, 4);
  const CC = ((parseInt(cleaned.substring(9, 10)) + 2) % 10) + 18;
  const YY = cleaned.substring(4, 6);
  const birthDate = new Date(`${CC + YY}-${MM}-01`);
  let date = parseInt(cleaned.substring(0, 2));
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
 *
 * To safely check the type of a plain, non-validated `string` input,
 * use `parseKennitala` and check the `.type` of the retured data object.
 * Example:
 *
 * ```js
 * const kt = parseKennitala(myInputString);
 * const isPerson = kt?.type === 'person';
 * ```
 */
export const isPersonKennitala = (kennitala: Kennitala): kennitala is KennitalaPerson =>
  // Temporary "kerfiskenntala"s for people start with 8 or 9
  /^[012389]/.test(kennitala);

/**
 * Detects if an input `Kennitala` is `KennitalaCompany`
 *
 * Assumes that the input `kt` is already validated as `Kennitala`
 * and performs no internal validation, and is thus unreliable
 * for random strings.
 *
 * To safely check the type of a plain, non-validated `string` input,
 * use `parseKennitala` and check the `.type` of the retured data object.
 * Example:
 *
 * ```js
 * const kt = parseKennitala(myInputString);
 * const isPerson = kt?.type === 'person';
 * ```
 */
export const isCompanyKennitala = (kennitala: Kennitala): kennitala is KennitalaCompany =>
  /^[4567]/.test(kennitala);

/**
 * Detects if an input `Kennitala` is a (temporary) "kerfiskennitala"
 * (a subset of valid `KennitalaPerson`s).
 *
 * Assumes that the input `kt` is already validated as `Kennitala`
 * and performs no internal validation, and is thus unreliable
 * for random strings.
 *
 * To safely check the type of a plain, non-validated `string` input,
 * use `parseKennitala` and check the `.temporary` status of the
 * retured data object.
 * Example:
 *
 * ```js
 * const kt = parseKennitala(myInputString);
 * const isPerson = !!kt?.temporary;
 * ```
 */
export const isTempKennitala = (kennitala: Kennitala): kennitala is KennitalaTemporary =>
  /^[89]/.test(kennitala);
