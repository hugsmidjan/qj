type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Finishable<A extends Array<any>> = ((...args: A) => void) & {
	finish(cancel?: boolean): void;
};

// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
const throttle = <A extends Array<any>>(
	func: (...args: A) => void,
	delay: number,
	skipFirst?: boolean
): Finishable<A> => {
	let timeout: TimerId | undefined;
	let throttled = 0;
	let _args: A;
	let _this: unknown;
	const throttledFn = function(...args) {
		_args = args;
		_this = this;
		if (!throttled) {
			skipFirst ? throttled++ : func.apply(_this, _args);
			timeout = (setTimeout(throttledFn.finish, delay) as unknown) as TimerId; // Go home TypeScript, you're drunk!
		}
		throttled++;
	} as Finishable<A>;
	throttledFn.finish = (cancel?: boolean) => {
		timeout && clearTimeout(timeout);
		!cancel && throttled > 1 && func.apply(_this, _args);
		throttled = 0;
	};
	return throttledFn;
};

/** Sugar to produce a dynamic debounced function that accepts its contents/behavior at call time.
 *
 * Usage:
 *
 *      const myThrottler = throttle.d(500);
 *      myThrottler(() => { alert('Hello world'); });
 *      myThrottler(() => { alert('I mean: Howdy world!'); });
 *      myThrottler((name) => { alert('Wazzap ' + name); }, 'world');
 */
throttle.d = (delay: number, skipFirst?: boolean) =>
	throttle(
		<A extends Array<any>>(fn: (...args: A) => void, ...args: A) => fn(...args),
		delay,
		skipFirst
	);
// TODO: Add tests for `throttle.d()`

export default throttle;
