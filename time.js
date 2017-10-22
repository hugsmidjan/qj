const SECOND = 1000;
const MINUTE = 60000;
const HOUR = 3600000;
const DAY = 86400000;
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

const sinceLast = (timestamp, periodSizeMS) => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp % periodSizeMS;
};
const untilNext = (timestamp, periodSizeMS) => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return periodSizeMS - sinceLast(timestamp, periodSizeMS);
  return periodSizeMS - timestamp % periodSizeMS;
};

const atLast = (timestamp, periodSizeMS) => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp - sinceLast(timestamp, periodSizeMS);
  return timestamp - timestamp % periodSizeMS;
};
const atNext = (timestamp, periodSizeMS) => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp + untilNext(timestamp, periodSizeMS);
  return timestamp + (periodSizeMS - timestamp % periodSizeMS);
};


const time = {
  SECOND,
  MINUTE,
  HOUR,
  DAY,

  sinceLast,
  untilNext,
  atLast,
  atNext,
  atStart: atLast,
  atEnd: atNext,
};

export {
  SECOND,
  MINUTE,
  HOUR,
  DAY,

  sinceLast,
  untilNext,
  atLast,
  atNext,
  atLast as atStart,
  atNext as atEnd,

  time as default,
};
