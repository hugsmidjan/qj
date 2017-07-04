import onNext from './onNext';

// Same as `onNext()` except auto-repeating
export default function onEvery(periodSizeMS, offsetMs, callback) {
  let canceller;
  const callbackOnNext = () => {
    canceller = onNext(periodSizeMS, offsetMs, () => {
      callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  const cancellerProxy = (execCallback) => canceller(execCallback);
  return cancellerProxy;
}
