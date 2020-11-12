type Cancellor = (catchPayload: unknown) => void;
type CancellablePromise = Promise<void> & {
	/**
	 * Rejects the promise with optional `catchPayload`.
	 *
	 * Default value for `catchPayload` is `new Error('cancelled')`
	 */
	cancel: Cancellor;
};

/**
 * Returns a Promise that resolves after `duration` milliseconds
 *
 * The returned Promise has a `.cancel()` method to reject the promise.
 */
export const wait = (duration: number) => {
	let _cancel: Cancellor;
	const p = new Promise((resume, reject) => {
		const timeout = setTimeout(resume, duration);
		_cancel = (catchPayload = new Error('cancelled')) => {
			clearTimeout(timeout);
			reject(catchPayload);
		};
	}) as CancellablePromise;
	p.cancel = (catchPayload) => _cancel(catchPayload);
	return p;
};

/**
 * Returns a "then"-function that adds lag/delay to a promise chain,
 * passing the promise payload through.
 */
export const addLag = (duraction: number) => <T>(payload: T) =>
	wait(duraction).then(() => payload);
