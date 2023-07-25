type Falsy = undefined | null | false | 0 | '';

export type ClassName = string | Falsy | ReadonlyArray<ClassName>;

/** Filters and concatenates any messy list of CSS classNames.
 *
 * All falsy values are neatly skipped.
 */
const classes = (...classNames: ReadonlyArray<ClassName>): string =>
  classNames
    .map((name) => (name && Array.isArray(name) ? classes(...name) : name))
    .filter((name) => !!name)
    .join(' ');

export default classes;
