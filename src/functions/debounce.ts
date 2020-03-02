type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Cancellable<A extends Array<any>> = ((...args: A) => void) & {
	cancel(finish?: boolean): void;
};

// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
const debounce = <A extends Array<any>>(
	func: (...args: A) => void,
	delay: number,
	immediate?: boolean
): Cancellable<A> => {
	let timeout: TimerId | undefined;
	let _args: A;
	let _this = this; // eslint-disable-line @typescript-eslint/no-this-alias
	let runNow: boolean | undefined;

	const debouncedFn = function(...args) {
		_args = args;
		_this = this;
		runNow = immediate && !timeout;

		timeout && clearTimeout(timeout);
		timeout = setTimeout(() => {
			debouncedFn.cancel(true);
		}, delay);

		runNow && func.apply(_this, _args);
	} as Cancellable<A>;

	debouncedFn.cancel = (finish) => {
		timeout && clearTimeout(timeout);
		finish && !runNow && func.apply(_this, _args);
		timeout = undefined;
		runNow = false;
	};

	return debouncedFn;
};

/** Sugar to produce a dynamic debounced function that accepts its contents/behavior at call time.
 *
 * Usage:
 *
 *      const myDebouncer = debounce.d(500);
 *      myDebouncer(() => { alert('Hello world'); });
 *      myDebouncer(() => { alert('I mean: Howdy world!'); });
 *      myDebouncer((name) => { alert('Wazzap ' + name); }, 'world');
 */
debounce.d = (delay: number, immediate?: boolean) =>
	debounce(
		<A extends Array<any>>(fn: (...args: A) => void, ...args: A) => fn(...args),
		delay,
		immediate
	);

export default debounce;
