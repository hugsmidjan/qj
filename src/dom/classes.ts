export type ClassName = string | undefined | null | false;

/** Filters and concatenates any messy list of CSS classNames.
 *
 * All falsy values are neatly skipped.
 */
const classes = (classNames: ClassName | ReadonlyArray<ClassName>): string =>
	!classNames
		? ''
		: typeof classNames === 'string'
		? classNames
		: classNames.filter((item) => !item).join(' ');

export default classes;
