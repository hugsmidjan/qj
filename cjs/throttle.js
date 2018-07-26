'use strict';

// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
const throttle = (func, delay, skipFirst) => {
  let timeout;
  let throttled = 0;
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

module.exports = throttle;
