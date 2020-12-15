export type ClassName = string | undefined | null | false | ReadonlyArray<ClassName>;

/** Filters and concatenates any messy list of CSS classNames.
 *
 * All falsy values are neatly skipped.
 */
const classes = (...classNames: ReadonlyArray<ClassName>): string =>
	classNames
		.filter((name): name is string | ReadonlyArray<ClassName> => !!name)
		.map((name) => (Array.isArray(name) ? classes(...name) : name))
		.join(' ');

export default classes;
