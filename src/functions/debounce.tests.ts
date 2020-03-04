import o, { Spy } from 'ospec';
import debounce from './debounce';

type Spied<Fn extends (...args: any) => any> = Spy<Parameters<Fn>, ReturnType<Fn>>;

const prep = (immediate?: boolean) => {
	const add = o.spy((a: number, b: number) => a + b);
	return [add, debounce(add, 20, immediate)] as const;
};

o.spec('debounce', () => {
	o('creates a wrapped function', () => {
		const [add, tAdd] = prep();

		o(tAdd(1, 2)).equals(undefined); // debounced Functions don't return anything
		o(add.callCount).equals(0);
		o('cancel' in tAdd).equals(true);
	});

	o.spec('debounces a function', () => {
		o('debounced calls wait for the delay', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);

			setTimeout(() => {
				o(add.callCount).equals(0);
				done();
			}, 10);
		});

		o('debounced calls are performed after the delay', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd(3, 4);

			setTimeout(() => {
				o(add.callCount).equals(1);
				o(add.args).deepEquals([3, 4]);
				done();
			}, 30);
		});
	});

	o.spec('cancel method', () => {
		o('does not run the debounced call instantly', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd.cancel();

			o(add.callCount).equals(0);
		});

		o('cancelled calls do not run after the delay', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd.cancel();

			setTimeout(() => {
				o(add.callCount).equals(0);
				done();
			}, 30);
		});

		o('can immediately finish the debounced call', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd.cancel(true);

			o(add.callCount).equals(1);
			o(add.args).deepEquals([2, 3]);
		});

		o('only runs the debounced call once', () => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd.cancel(true);
			tAdd.cancel(true);
			tAdd.cancel(true);

			o(add.callCount).equals(1);
			o(add.args).deepEquals([2, 3]);
		});

		o('does not run cancelled calls later either', (done) => {
			const [add, tAdd] = prep();
			tAdd(1, 2);
			tAdd(2, 3);
			tAdd.cancel(true);

			setTimeout(() => {
				tAdd.cancel(true);
				o(add.callCount).equals(1);
				o(add.args).deepEquals([2, 3]);
				done();
			}, 30);
		});
	});

	o.spec('skipFirst option', () => {
		o('skips the first call', () => {
			const [add, tAdd] = prep(true);
			tAdd(1, 2);
			tAdd(2, 3);
			o(add.callCount).equals(1);
			o(add.args).deepEquals([1, 2]);
		});

		o('debounced calls are performed after the delay', (done) => {
			const [add, tAdd] = prep(true);
			tAdd(1, 2);
			tAdd(2, 3);

			setTimeout(() => {
				o(add.callCount).equals(2);
				o(add.args).deepEquals([2, 3]);
				done();
			}, 30);
		});
	});

	o('passes `this` to the debounced function', () => {
		const add = o.spy(function(this: { b: number; c?: number }, a: number) {
			this.c = a + this.b;
		});
		const foo = {
			tAdd: debounce(add, 20, true),
			b: 10,
			c: -1 as number,
		};

		foo.tAdd(5);
		o(add.callCount).equals(1);
		o(foo.c).equals(15);
	});
});

o.spec('debounce.d', () => {
	o('creates a dynamic function', (done) => {
		const debouncer = debounce.d(20, true);

		let sideEffect: number | undefined;
		const add = (a: number, b: number) => {
			sideEffect = a + b;
		};
		const multiply = (a: number, b: number) => {
			sideEffect = a * b;
		};

		debouncer(add, 3, 3);
		o(sideEffect).equals(6);

		debouncer(multiply, 3, 3);
		debouncer.cancel(true);
		o(sideEffect).equals(9);

		debouncer(add, 5, 5);
		debouncer(multiply, 5, 5);
		setTimeout(() => {
			o(sideEffect).equals(25);
			done();
		}, 30);
	});

	o('passes `this` to the dynamic function', () => {
		const foo = {
			do: debounce.d(20, true),
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
		foo.do.cancel(true);
		o(foo.c).equals(30);
	});
});
