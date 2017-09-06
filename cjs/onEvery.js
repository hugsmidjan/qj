'use strict';

/*
  Executes callback when the clock strikes the next whole `periodSizeMs`
  Returns a canceller function - that allows for optional execution of the callback.

  Usage:

      const MINUTE = 60*1000;
      const HOUR = 60*MINUTE;

      // Log the current time when the clock strikes next noon or midnight.
      const at12 = onNext(12*HOUR, () => console.log(Date()) );

      // Log the current time 15 minutes after the clock strikes next noon or midnight.
      const at12_15 = onNext(12*HOUR, 15*MINUTE, () => console.log(Date()) );

      // Cancel the 12 o'clock callback:
      at12();

      // Cancel the 12:15 schedule and run the callback right now!
      at12_15(true);

*/
function onNext(periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var msToNext = periodSizeMS - (Date.now() - offsetMs) % periodSizeMS;
  // add a slight .5% - 1% fuzz to the timer to avoid
  // A) crazy spikes in server-load (in case of multiple clients)
  // B) accidental under-shoots caused by bad timer handling in the browser
  var fuzz = (1 + Math.random()) * Math.max(.01*periodSizeMS, 100);
  var timeout = setTimeout(callback, msToNext + fuzz);

  var canceller = function (execCallback) {
    clearTimeout(timeout);
    execCallback && callback();
  };
  return canceller;
}

// Same as `onNext()` except auto-repeating
function onEvery(periodSizeMS, offsetMs, callback) {
  var canceller;
  var callbackOnNext = function () {
    canceller = onNext(periodSizeMS, offsetMs, function () {
      callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  var cancellerProxy = function (execCallback) { return canceller(execCallback); };
  return cancellerProxy;
}

module.exports = onEvery;
