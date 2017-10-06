import onNext from './onNext';

// Auto-repeating version of `onNext()`
export default function onEvery(periodSizeMS, offsetMs, callback) {
  let nextUp;
  const callbackOnNext = () => {
    nextUp = onNext(periodSizeMS, offsetMs, () => {
      callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  return {
    cancel: (execCallback) => { nextUp.cancel(execCallback); },
  };
}
