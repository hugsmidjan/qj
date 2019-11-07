type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Finishable<F> = F & { finish(): void };

// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
const throttle = <A extends Array<any>, F extends (...args: A) => void>(
	func: F,
	delay: number,
	skipFirst?: boolean
): Finishable<F> => {
	let timeout: TimerId | undefined;
	let throttled = 0;
	let _args: A;
	let _this: unknown;
	const throttledFn = function(...args) {
		_args = args;
		_this = this;
		if (!throttled) {
			skipFirst ? throttled++ : func.apply(_this, _args);
			timeout = setTimeout(throttledFn.finish, delay);
		}
		throttled++;
	} as Finishable<F>;
	throttledFn.finish = () => {
		timeout && clearTimeout(timeout);
		throttled > 1 && func.apply(_this, _args);
		throttled = 0;
	};
	return throttledFn;
};

export default throttle;
