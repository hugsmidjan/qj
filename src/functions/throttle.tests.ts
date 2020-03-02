import o, { Spy } from 'ospec';
import throttle from './throttle';

type Spied<Fn extends (...args: any) => any> = Spy<Parameters<Fn>, ReturnType<Fn>>;

const _add = (a: number, b: number) => {
	return a + b;
};

// TODO: Add tests asserting how `this` is preserved/passed-through

o.spec('throttle', () => {
	o('creates a wrapped function', () => {
		const add = o.spy(_add);
		const tAdd = throttle(add, 20);

		o(tAdd(1, 2)).equals(undefined); // throttled Functions don't return anything
		o(add.args).deepEquals([1, 2]);
		o(add.callCount).equals(1);
		o('finish' in tAdd).equals(true);
	});

	o.spec('throttles a function', () => {
		const add = o.spy(_add);
		const tAdd = throttle(add, 20);

		tAdd(1, 2);
		tAdd(2, 3);
		tAdd(3, 4);

		o('throttled calls wait for the delay', (done) => {
			setTimeout(() => {
				o(add.callCount).equals(1);
				o(add.args).deepEquals([1, 2]);
				done();
			}, 10);
		});

		o('throttled calls are performed after the delay', (done) => {
			setTimeout(() => {
				o(add.callCount).equals(2);
				o(add.args).deepEquals([3, 4]);
				done();
			}, 30);
		});
	});

	o.spec('finish method', () => {
		const add = o.spy(_add);
		const tAdd = throttle(add, 20);

		o('runs the throttled call instantly', () => {
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);
			tAdd.finish();

			o(add.callCount).equals(2);
			o(add.args).deepEquals([3, 4]);
		});

		o('only runs the throttled call once', () => {
			tAdd.finish();
			tAdd.finish();
			tAdd.finish();

			o(add.callCount).equals(2);
			o(add.args).deepEquals([3, 4]);
		});

		o('finished calls do not run after the delay', (done) => {
			setTimeout(() => {
				o(add.callCount).equals(2);
				o(add.args).deepEquals([3, 4]);
				done();
			}, 30);
		});

		o('can cancel the throttled call', () => {
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);
			tAdd.finish(true);

			o(add.callCount).equals(3);
			o(add.args).deepEquals([1, 2]);
		});

		o('does not run cancelled calls later', () => {
			tAdd.finish();

			o(add.callCount).equals(3);
			o(add.args).deepEquals([1, 2]);
		});
	});

	o.spec('skipFirst option', () => {
		const add = o.spy(_add);
		const tAdd = throttle(add, 20, true);

		o('skips the first call', () => {
			tAdd(1, 2);
			tAdd(2, 3);
			o(add.callCount).equals(0);
		});

		o('throttled calls are performed after the delay', (done) => {
			setTimeout(() => {
				o(add.callCount).equals(1);
				o(add.args).deepEquals([2, 3]);
				done();
			}, 30);
		});
	});
});

o.spec('throttle.d', () => {
	const throttler = throttle.d(20);
	let sideEffect: number | undefined;
	const add = (a: number, b: number) => {
		sideEffect = a + b;
	};
	const multiply = (a: number, b: number) => {
		sideEffect = a * b;
	};

	o('creates a dynamic function', (done) => {
		throttler(add, 3, 3);
		o(sideEffect).equals(6);

		throttler(multiply, 3, 3);
		throttler.finish();
		o(sideEffect).equals(9);

		throttler(add, 5, 5);
		throttler(multiply, 5, 5);
		setTimeout(() => {
			o(sideEffect).equals(25);
			done();
		}, 30);
	});
});
