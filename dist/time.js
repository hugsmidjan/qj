Object.defineProperty(exports, '__esModule', { value: true });

var SECOND = 1000;
var MINUTE = 60000;
var HOUR = 3600000;
var DAY = 86400000;
var sinceLast = function (timestamp, periodSizeMS) {
    // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
    return timestamp >= 0 ?
        timestamp % periodSizeMS :
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
var safeTimeout = function (callback, delay) {
    var startingTime = Date.now();
    var timeoutId = setTimeout(function () {
        var undershootMs = startingTime + delay - Date.now();
        if (undershootMs > 0) {
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
var onNext = function (periodSizeMS, offsetMs, callback) {
    if (typeof offsetMs !== 'number') {
        callback = offsetMs;
        offsetMs = 0;
    }
    var _callback = callback;
    if (!_callback) {
        return;
    }
    var msToNext = untilNext(Date.now(), periodSizeMS) + offsetMs;
    var timeoutId = msToNext > 2000 ?
        safeTimeout(_callback, msToNext) :
        // quicker (and dirtier) alternative to safeTimeout() for shorter periodSizes
        (function (tId) { return function () { return tId; }; })(setTimeout(_callback, msToNext + 50));
    return {
        cancel: function (execCallback) {
            clearTimeout(timeoutId());
            execCallback && _callback();
        },
    };
};
// Auto-repeating version of `onNext()`
var onEvery = function (periodSizeMS, offsetMs, callback) {
    if (typeof offsetMs !== 'number') {
        callback = offsetMs;
        offsetMs = 0;
    }
    var _callback = callback;
    if (!_callback) {
        return;
    }
    var nextUp;
    var callbackOnNext = function () {
        nextUp = onNext(periodSizeMS, offsetMs, function () {
            _callback();
            callbackOnNext();
        });
    };
    callbackOnNext();
    return {
        cancel: function (execCallback) {
            nextUp && nextUp.cancel(execCallback);
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

exports.DAY = DAY;
exports.HOUR = HOUR;
exports.MINUTE = MINUTE;
exports.SECOND = SECOND;
exports.atEnd = atNext;
exports.atLast = atLast;
exports.atNext = atNext;
exports.atStart = atLast;
exports.default = time;
exports.onEvery = onEvery;
exports.onNext = onNext;
exports.safeTimeout = safeTimeout;
exports.sinceLast = sinceLast;
exports.untilNext = untilNext;
