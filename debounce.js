// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
const debounce = (func, delay, immediate) => {
  let timeout;
  const debouncedFn = !immediate ?
      // simple delayed function
      function (...args) {
        const _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(_this, args);
        }, delay);
      }:
      // more complex immediately called function
      function (...args) {
        const runNow = !timeout && immediate;
        const _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          !runNow  &&  func.apply(_this, args); // don't re-invoke `func` if runNow is true
          timeout = 0;
        }, delay);
        runNow  &&  func.apply(_this, args);
      };
  debouncedFn.cancel = () => {
    clearTimeout(timeout);
    timeout = 0;
  };
  return debouncedFn;
};

// Sugar to produce a debounced function
// that accepts its contents/behavior at call time.
// Usage:
//     const myDebouncer = debounce.d(500);
//     myDebouncer(() => { alert('Hello world'); });
//     myDebouncer(() => { alert('I mean: Howdy world!'); });
debounce.d = (delay, immediate) => debounce((fn) => fn(), delay, immediate);

export default debounce;
