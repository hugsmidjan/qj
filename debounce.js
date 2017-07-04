// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
export default function debounce(func, delay, immediate) {
  if ( typeof delay === 'boolean' ) {
    immediate = delay;
    delay = 0;
  }
  delay = delay || 50;
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
  debouncedFn.cancel = function () {
    clearTimeout(timeout);
    timeout = 0;
  };
  return debouncedFn;
}
