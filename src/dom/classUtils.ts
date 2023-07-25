type Falsy = undefined | null | false | 0 | '';

export type ClassNames = string | Falsy | ReadonlyArray<ClassNames>;

/** Filters and concatenates any messy list of CSS classNames.
 *
 * All falsy values are neatly skipped.
 */
export const classes = (...classNames: ReadonlyArray<ClassNames>): string =>
  classNames
    .map((name) => (name && Array.isArray(name) ? classes(...name) : name))
    .filter((name) => !!name)
    .join(' ');

// ===========================================================================

export type Modifiers = string | Falsy | ReadonlyArray<Modifiers>;

export const modifiedClass = (
  bemClass: string,
  modifier: Modifiers,
  extraClass?: string
): string => {
  const flattenModifiers = (modifier: Modifiers): string =>
    !modifier || !modifier.length
      ? ''
      : typeof modifier === 'string'
      ? ' ' + bemClass + '--' + modifier
      : modifier.map(flattenModifiers).join('');

  return bemClass + flattenModifiers(modifier) + (extraClass ? ' ' + extraClass : '');
};
