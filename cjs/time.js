'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var sinceLast = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp >= 0 ?
      timestamp % periodSizeMS:
      (periodSizeMS + timestamp % periodSizeMS) % DAY;
};
var untilNext = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return periodSizeMS - sinceLast(timestamp, periodSizeMS);
};

var atLast = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp - sinceLast(timestamp, periodSizeMS);
};
var atNext = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp + untilNext(timestamp, periodSizeMS);
  return timestamp + (periodSizeMS - sinceLast(timestamp, periodSizeMS));
};




/*
  Executes callback when the clock strikes the next whole `periodSizeMs`
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
var onNext = function (periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var msToNext = untilNext(Date.now(), periodSizeMS) + offsetMs;
  // OPINIONATED: Add a slight .5% - 1% fuzz to the timer to avoid
  // A) crazy spikes in server-load (in case of multiple clients)
  // B) accidental under-shoots caused by bad timer handling in the browser
  var fuzz = (1 + Math.random()) * Math.max(.01*periodSizeMS, 100);
  var timeout = setTimeout(callback, msToNext + fuzz);

  return {
    cancel: function (execCallback) {
      clearTimeout(timeout);
      execCallback && callback();
    },
  };
};

// Auto-repeating version of `onNext()`
var onEvery = function (periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var nextUp;
  var callbackOnNext = function () {
    nextUp = onNext(periodSizeMS, offsetMs, function () {
      callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  return {
    cancel: function (execCallback) { nextUp.cancel(execCallback); },
  };
};



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
exports['default'] = time;
