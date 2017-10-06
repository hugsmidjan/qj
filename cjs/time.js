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
  return timestamp % periodSizeMS;
};
var untilNext = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return periodSizeMS - sinceLast(timestamp, periodSizeMS);
  return periodSizeMS - timestamp % periodSizeMS;
};

var atLast = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp - sinceLast(timestamp, periodSizeMS);
  return timestamp - timestamp % periodSizeMS;
};
var atNext = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp + untilNext(timestamp, periodSizeMS);
  return timestamp + (periodSizeMS - timestamp % periodSizeMS);
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
};

exports.SECOND = SECOND;
exports.MINUTE = MINUTE;
exports.HOUR = HOUR;
exports.DAY = DAY;
exports.sinceLast = sinceLast;
exports.untilNext = untilNext;
exports.atLast = atLast;
exports.atNext = atNext;
exports['default'] = time;
