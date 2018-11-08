Object.defineProperty(exports, '__esModule', { value: true });

//@flow
var SECOND = 1000;
var MINUTE = 60000;
var HOUR = 3600000;
var DAY = 86400000;
/*
  Super fast mini-helpers to find start/end of certain periods within the `timestamp` day.
  Done without using any expensive `Date` operations.
  Useful for setting timers/timeouts.

  Usage:
      const unixDate = 1486289500131; // some random Date.

      const ms_at_start_of_Day = atLast(unixDate, DAY);
      const ms_at_start_of_Hour = atLast(unixDate, HOUR);
      const ms_at_start_of_12hourPeriod = atLast(unixDate, 12*HOUR);
      const ms_at_end_of_Day = atNext(unixDate, DAY);
      const ms_at_end_of_30MinutePeriod = atNext(unixDate, 30*MINUTE);
      const ms_since_last_midnight = sinceLast(unixDate, DAY);
*/


/*::
  type Callback = () => any;
*/

var sinceLast = function (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp >= 0 ?
      timestamp % periodSizeMS:
      (periodSizeMS + timestamp % periodSizeMS) % DAY;
};
var untilNext = function (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return periodSizeMS - sinceLast(timestamp, periodSizeMS);
};

var atLast = function (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp - sinceLast(timestamp, periodSizeMS);
};
var atNext = function (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp + untilNext(timestamp, periodSizeMS);
  return timestamp + (periodSizeMS - sinceLast(timestamp, periodSizeMS));
};





/*
  Safe timeout which guarantees the timer doesn't undershoot
  (i.e. doesn't fire a few milliseconds too early)
  Returns a getter function for the current timeout ID
*/
var safeTimeout = function (callback/*:Callback*/, delay/*:number*/)/*:()=>TimeoutID*/ {
  var startingTime = Date.now();
  var timeoutId = setTimeout(function () {
    var undershootMs = startingTime + delay - Date.now();
    if ( undershootMs > 0 ) {
      timeoutId = setTimeout(callback, undershootMs + 50);
    }
    else {
      callback();
    }
  }, delay + 50);
  return function () { return timeoutId; };
};


/*
  Executes callback which is guaranteed to fire *AFTER* the clock strikes
  the next whole `periodSizeMs`.
  Returns an object with a `cancel` function - which optionally executes the callback.

  Usage:
      const MINUTE = 60*1000;
      const HOUR = 60*MINUTE;

      // Log the current time when the clock strikes next noon or midnight.
      const at12 = onNext(12*HOUR, () => console.log(Date()) );

      // Log the current time 15 minutes after the clock strikes next noon or midnight.
      const at12_15 = onNext(12*HOUR, 15*MINUTE, () => console.log(Date()) );

      // Cancel the 12 o'clock callback:
      at12.cancel();

      // Nevermind the 12:15 schedule. Run the callback right now!
      at12_15.cancel(true);

*/
var onNext = function (periodSizeMS/*:number*/, offsetMs/*:number|Callback*/, callback/*:?Callback*/) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var _callback = callback;
  if ( !_callback ) { return;}
  var msToNext = untilNext(Date.now(), periodSizeMS) + offsetMs;

  var timeoutId = msToNext > 2000 ?
      safeTimeout(_callback, msToNext):
      // quicker (and dirtier) alternative to safeTimeout() for shorter periodSizes
      (function (tId) { return function () { return tId; }; })(setTimeout(_callback, msToNext + 50));

  return {
    cancel: function (execCallback/*:boolean*/) {
      clearTimeout( timeoutId() );
      execCallback && _callback(); // NOTE: Flow thinks callback may still be null|undefined
    },
  };
};

// Auto-repeating version of `onNext()`
var onEvery = function (periodSizeMS/*:number*/, offsetMs/*:number|Callback*/, callback/*:?Callback*/) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var _callback = callback;
  if ( !_callback ) { return;}
  var nextUp;
  var callbackOnNext = function () {
    nextUp = onNext(periodSizeMS, offsetMs, function () {
      _callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  return {
    cancel: function (execCallback/*:boolean*/) {
      //$FlowFixMe - nextUp *IS* defined as side-effect of running callbackOnNext() above
      nextUp.cancel(execCallback);
    },
  };
};


// FIXME: Remove this default export in v2
var time = {
  SECOND: SECOND,
  MINUTE: MINUTE,
  HOUR: HOUR,
  DAY: DAY,

  sinceLast: sinceLast,
  untilNext: untilNext,
  atLast: atLast,
  atNext: atNext,
  atStart: atLast,
  atEnd: atNext,

  onNext: onNext,
  onEvery: onEvery,
  safeTimeout: safeTimeout,
};

exports.SECOND = SECOND;
exports.MINUTE = MINUTE;
exports.HOUR = HOUR;
exports.DAY = DAY;
exports.sinceLast = sinceLast;
exports.untilNext = untilNext;
exports.atLast = atLast;
exports.atNext = atNext;
exports.atStart = atLast;
exports.atEnd = atNext;
exports.onNext = onNext;
exports.onEvery = onEvery;
exports.safeTimeout = safeTimeout;
exports.default = time;
