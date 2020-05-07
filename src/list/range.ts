/**
 * Creates a Array containing integers ranging between `from` and `to`.
 * Ranges can be either ascending or descending.
 *
 * @param from Starting value
 * @param to End value
 * @param step Positive number. Defaults to `1`
 */
const range = (from: number, to: number, step?: number) => {
	// Fuck JavaScript's type coercion!
	if (Number(from + to) !== from + to) {
		throw new Error('invalid range');
	}
	const asc = from < to;
	const validStep = step && step > 0 && Number(step) === step;
	step = (asc ? 1 : -1) * ((validStep && step) || 1);
	const arr: Array<number> = [];
	let curr = from;
	while (asc ? curr <= to : to <= curr) {
		arr[arr.length] = curr;
		curr += step;
	}
	return arr;
};

export default range;
