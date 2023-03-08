import {
  cleanKennitalaAggressive,
  cleanKennitalaCareful,
  formatKennitala,
  getKennitalaBirthDate,
  isValidKennitala,
  Kennitala,
  KennitalaCompany,
  KennitalaPerson,
} from './kennitala';

export type {
  /**
   * @deprecated Import `Kennitala` from `@hugsmidjan/qj/kennitala` instead.
   *
   * (Will be removed in v5)
   */
  Kennitala,
  /**
   * @deprecated Import `KennitalaCompany` from `@hugsmidjan/qj/kennitala` instead.
   *
   * (Will be removed in v5)
   */
  KennitalaCompany,
  /**
   * @deprecated Import `KennitalaPerson` from `@hugsmidjan/qj/kennitala` instead.
   *
   * (Will be removed in v5)
   */
  KennitalaPerson,
};

/**
 * A valid 10-digit Kennitala string for either a person or a compnay
 *
 * @deprecated Use `Kennitala` from `@hugsmidjan/qj/kennitala` instead.
 *
 * (Will be removed in v5)
 */
export type KennitalaReal = Kennitala;

declare const _KennitalaRobot__Brand: unique symbol;
/**
 * A valid 10-digit Kennitala string for a "Gervimaður"
 *
 * @deprecated Use `KennitalaPerson` from `@hugsmidjan/qj/kennitala` instead.
 *
 * (Will be removed in v5)
 */
export type KennitalaRobot = KennitalaPerson & { [_KennitalaRobot__Brand]: true };

// ---------------------------------------------------------------------------

/**
 * @deprecated Use `isValidKennitala` from `@hugsmidjan/qj/kennitala` instead.
 *
 * (Will be removed in v5)
 */
function validKennitala(
  /**
   * A reasonably kennitala-ish string
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
    type?: 'einst' | 'fyrirt';
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
  const cleaner =
    opts.clean === 'aggressive' ? cleanKennitalaAggressive : cleanKennitalaCareful;
  kt = kt && cleaner(kt);
  if (!kt) {
    return true;
  }
  const typeMap = {
    einst: 'person',
    fyrirt: 'company',
    '': undefined,
  } as const;

  return isValidKennitala(kt, {
    ...opts,
    type: typeMap[opts.type || ''],
  });
}

validKennitala.clean = cleanKennitalaCareful;
validKennitala.cleanAggressive = cleanKennitalaAggressive;
validKennitala.format = formatKennitala;
validKennitala.getBirthday = getKennitalaBirthDate;

export default validKennitala;
