// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
export default function throttle(func, delay, skipFirst) {
  if ( typeof delay === 'boolean' ) {
    skipFirst = delay;
    delay = 0;
  }
  delay = delay || 50;
  let throttled = 0;
  let timeout;
  let _args;
  let _this;
  const throttledFn = function (...args) {
    _args = args;
    _this = this;
    if (!throttled) {
      skipFirst ?
          throttled++:
          func.apply(_this, _args);
      timeout = setTimeout(throttledFn.finish, delay);
    }
    throttled++;
  };
  throttledFn.finish = () => {
    clearTimeout( timeout );
    throttled>1 && func.apply(_this, _args);
    throttled = 0;
  };
  return throttledFn;
};
