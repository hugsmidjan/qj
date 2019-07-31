type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Cancellable<F> = F & { cancel(): void }


// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
const debounce = <F extends (...args: any) => void>(func: F, delay: number, immediate?: boolean): Cancellable<F> => {
  let timeout: TimerId | undefined;
  const debouncedFn = function (...args) {
    const runNow = immediate && !timeout;
    const _this = this;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      !runNow  &&  func.apply(_this, args); // don't re-invoke `func` if runNow is true
      timeout = undefined;
    }, delay);
    runNow  &&  func.apply(_this, args);
  } as Cancellable<F>;
  debouncedFn.cancel = () => {
    timeout && clearTimeout(timeout);
    timeout = undefined;
  };
  return debouncedFn;
};

clearTimeout(setTimeout(() => {}, 1000));

// Sugar to produce a dynamic debounced function
// that accepts its contents/behavior at call time.
// Usage:
//     const myDebouncer = debounce.d(500);
//     myDebouncer(() => { alert('Hello world'); });
//     myDebouncer(() => { alert('I mean: Howdy world!'); });
debounce.d = (delay: number, immediate?: boolean) => debounce((fn: ()=>void) => fn(), delay, immediate);

export default debounce;
