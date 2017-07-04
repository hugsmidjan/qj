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
export default function onNext(periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  const msToNext = periodSizeMS - (Date.now() - offsetMs) % periodSizeMS;
  // add a slight .5% - 1% fuzz to the timer to avoid
  // A) crazy spikes in server-load (in case of multiple clients)
  // B) accidental under-shoots caused by bad timer handling in the browser
  const fuzz = (1 + Math.random()) * Math.max(.01*periodSizeMS, 100);
  const timeout = setTimeout(callback, msToNext + fuzz);

  const canceller = (execCallback) => {
    clearTimeout(timeout);
    execCallback && callback();
  };
  return canceller;
}
