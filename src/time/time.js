//@flow
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


/*::
  type Callback = () => any;
*/

const sinceLast = (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp >= 0 ?
      timestamp % periodSizeMS:
      (periodSizeMS + timestamp % periodSizeMS) % DAY;
};
const untilNext = (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return periodSizeMS - sinceLast(timestamp, periodSizeMS);
};

const atLast = (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp - sinceLast(timestamp, periodSizeMS);
};
const atNext = (timestamp/*:number*/, periodSizeMS/*:number*/)/*:number*/ => {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp + untilNext(timestamp, periodSizeMS);
  return timestamp + (periodSizeMS - sinceLast(timestamp, periodSizeMS));
};





/*
  Safe timeout which guarantees the timer doesn't undershoot
  (i.e. doesn't fire a few milliseconds too early)
  Returns a getter function for the current timeout ID
*/
const safeTimeout = (callback/*:Callback*/, delay/*:number*/)/*:()=>TimeoutID*/ => {
  const startingTime = Date.now();
  let timeoutId = setTimeout(() => {
    const undershootMs = startingTime + delay - Date.now();
    if ( undershootMs > 0 ) {
      timeoutId = setTimeout(callback, undershootMs + 50);
    }
    else {
      callback();
    }
  }, delay + 50);
  return () => timeoutId;
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
const onNext = (periodSizeMS/*:number*/, offsetMs/*:number|Callback*/, callback/*:?Callback*/) => {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  const _callback = callback;
  if ( !_callback ) { return;}
  const msToNext = untilNext(Date.now(), periodSizeMS) + offsetMs;

  const timeoutId = msToNext > 2000 ?
      safeTimeout(_callback, msToNext):
      // quicker (and dirtier) alternative to safeTimeout() for shorter periodSizes
      (tId => () => tId)(setTimeout(_callback, msToNext + 50));

  return {
    cancel: (execCallback/*:boolean*/) => {
      clearTimeout( timeoutId() );
      execCallback && _callback(); // NOTE: Flow thinks callback may still be null|undefined
    },
  };
};

// Auto-repeating version of `onNext()`
const onEvery = (periodSizeMS/*:number*/, offsetMs/*:number|Callback*/, callback/*:?Callback*/) => {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  const _callback = callback;
  if ( !_callback ) { return;}
  let nextUp;
  const callbackOnNext = () => {
    nextUp = onNext(periodSizeMS, offsetMs, () => {
      _callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  return {
    cancel: (execCallback/*:boolean*/) => {
      //$FlowFixMe - nextUp *IS* defined as side-effect of running callbackOnNext() above
      nextUp.cancel(execCallback);
    },
  };
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

  onNext,
  onEvery,
  safeTimeout,
};


// FIXME: Remove this default export in v2
export default {
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

  onNext,
  onEvery,
  safeTimeout,
};
