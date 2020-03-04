type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Cancellable<A extends Array<any>> = ((...args: A) => void) & {
	cancel(finish?: boolean): void;
};

/** returns a debounced function that only runs after `delay` milliseconds
 * of quiet-time.
 * The returned function also has a nice `.cancel()` method.
 */
const debounce = <A extends Array<any>>(
	func: (...args: A) => void,
	delay: number,
	immediate?: boolean
): Cancellable<A> => {
	let timeout: TimerId | undefined;
	let _args: A;
	let _this = this; // eslint-disable-line @typescript-eslint/no-this-alias

	const debouncedFn: Cancellable<A> = function(...args) {
		_args = args;
		_this = this;

		immediate && !timeout && func.apply(_this, _args);

		timeout && clearTimeout(timeout);
		timeout = setTimeout(() => {
			debouncedFn.cancel(true);
		}, delay);
	};

	debouncedFn.cancel = (finish) => {
		timeout && clearTimeout(timeout);
		finish && !!timeout && func.apply(_this, _args);
		timeout = undefined;
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
		function<A extends Array<any>>(fn: (...args: A) => void, ...args: A) {
			fn.apply(this, args);
		},
		delay,
		immediate
	);

// TODO: Write tests based on ./throttle.tests.ts

export default debounce;
