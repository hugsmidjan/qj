import o, { Spy } from 'ospec';
import throttle from './throttle';

type Spied<Fn extends (...args: any) => any> = Spy<Parameters<Fn>, ReturnType<Fn>>;

const prep = (skipFirst?: boolean) => {
	const add = o.spy((a: number, b: number) => a + b);
	return [add, throttle(add, 20, skipFirst)] as const;
};

o.spec('throttle', () => {
	o('creates a wrapped function', () => {
		const [add, tAdd] = prep();

		o(tAdd(1, 2)).equals(undefined); // throttled Functions don't return anything
		o(add.args).deepEquals([1, 2]);
		o(add.callCount).equals(1);
		o('finish' in tAdd).equals(true);
	});

	o.spec('throttles a function', () => {
		o('throttled calls wait for the delay', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);

			setTimeout(() => {
				o(add.callCount).equals(1);
				o(add.args).deepEquals([1, 2]);
				done();
			}, 10);
		});

		o('throttled calls are performed after the delay', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);

			setTimeout(() => {
				o(add.callCount).equals(2);
				o(add.args).deepEquals([3, 4]);
				done();
			}, 30);
		});
	});

	o.spec('finish method', () => {
		o('runs the throttled call instantly', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);
			tAdd.finish();

			o(add.callCount).equals(2);
			o(add.args).deepEquals([3, 4]);
		});

		o('only runs the throttled call once', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);
			tAdd.finish();
			tAdd.finish();
			tAdd.finish();

			o(add.callCount).equals(2);
			o(add.args).deepEquals([3, 4]);
		});

		o('finished calls do not run after the delay', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);
			tAdd.finish();

			setTimeout(() => {
				o(add.callCount).equals(2);
				o(add.args).deepEquals([3, 4]);
				done();
			}, 30);
		});

		o('can cancel the throttled call', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);
			tAdd.finish(true);

			o(add.callCount).equals(1);
			o(add.args).deepEquals([1, 2]);
		});

		o('does not run cancelled calls later', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd.finish(true);
			tAdd.finish();

			o(add.callCount).equals(1);
			o(add.args).deepEquals([1, 2]);
		});
	});

	o.spec('skipFirst option', () => {
		o('skips the first call', () => {
			const [add, tAdd] = prep(true);
			tAdd(1, 2);
			tAdd(2, 3);
			o(add.callCount).equals(0);
		});

		o('throttled calls are performed after the delay', (done) => {
			const [add, tAdd] = prep(true);
			tAdd(1, 2);
			tAdd(2, 3);

			setTimeout(() => {
				o(add.callCount).equals(1);
				o(add.args).deepEquals([2, 3]);
				done();
			}, 30);
		});
	});

	o('passes `this` to the throttled function', () => {
		const add = o.spy(function(this: { b: number; c?: number }, a: number) {
			this.c = a + this.b;
		});
		const foo = {
			tAdd: throttle(add, 20),
			b: 10,
			c: -1 as number,
		};

		foo.tAdd(5);
		o(add.callCount).equals(1);
		o(foo.c).equals(15);
	});
});

o.spec('throttle.d', () => {
	o('creates a dynamic function', (done) => {
		const throttler = throttle.d(20);
		let sideEffect: number | undefined;
		const add = (a: number, b: number) => {
			sideEffect = a + b;
		};
		const multiply = (a: number, b: number) => {
			sideEffect = a * b;
		};

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

	o('passes `this` to the dynamic function', () => {
		const foo = {
			do: throttle.d(20),
			b: 10,
			c: -1 as number,
		};
		const add = function(this: typeof foo, a: number) {
			this.c = a + this.b;
		};
		const multiply = function(this: typeof foo, a: number) {
			this.c = a * this.b;
		};

		foo.do(add, 3);
		o(foo.c).equals(13);

		foo.do(multiply, 3);
		foo.do.finish();
		o(foo.c).equals(30);
	});
});
