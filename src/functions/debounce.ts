type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Cancellable<A extends Array<any>> = ((...args: A) => void) & {
	cancel(): void;
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

	const debouncedFn = function(...args) {
		const runNow = immediate && !timeout;
		const _this = this; // eslint-disable-line @typescript-eslint/no-this-alias

		timeout && clearTimeout(timeout);
		timeout = setTimeout(() => {
			!runNow && func.apply(_this, args); // don't re-invoke `func` if runNow is true
			timeout = undefined;
		}, delay);

		runNow && func.apply(_this, args);
	} as Cancellable<A>;

	debouncedFn.cancel = () => {
		timeout && clearTimeout(timeout);
		timeout = undefined;
	};

	return debouncedFn;
};

// Sugar to produce a dynamic debounced function
// that accepts its contents/behavior at call time.
// Usage:
//     const myDebouncer = debounce.d(500);
//     myDebouncer(() => { alert('Hello world'); });
//     myDebouncer(() => { alert('I mean: Howdy world!'); });
debounce.d = (delay: number, immediate?: boolean) =>
	debounce((fn: () => void) => fn(), delay, immediate);

export default debounce;
