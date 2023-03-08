import o from 'ospec';

import promiseAll from './promiseAllObject';

const errorOnReject = (error: unknown) => {
  o(error).equals('Promise should not have thrown');
};

o.spec('promiseAllObject', () => {
  o.spec('validate rejections', () => {
    if (process.env.NODE_ENV !== 'production') {
      o('should reject in dev mode if not receiving an object', () => {
        let successes = 0;
        let fails = 0;

        const promises = [
          // @ts-expect-error  (testing bad input)
          promiseAll(/*undefined*/),
          // @ts-expect-error  (testing bad input)
          promiseAll(null),
          // @ts-expect-error  (testing bad input)
          promiseAll('string'),
          // @ts-expect-error  (testing bad input)
          promiseAll(123),
          // @ts-expect-error  (testing bad input)
          promiseAll(true),
          // @ts-expect-error  (testing bad input)
          promiseAll([1]),
        ].map((promise) =>
          promise
            .then(() => {
              successes++;
            })
            .catch((e: Error) => {
              o(e instanceof TypeError).equals(true);
              o(e.message).equals('The input argument must be a plain object');
              fails++;
            })
        );

        return Promise.all(promises).then(() => {
          o(fails).equals(promises.length);
          o(successes).equals(0);
        });
      });
    } else {
      o('should reject in production if receiving a nully value', () => {
        let successes = 0;
        let fails = 0;

        const promises = [
          // @ts-expect-error  (testing bad input)
          promiseAll(/*undefined*/),
          // @ts-expect-error  (testing bad input)
          promiseAll(null),
        ].map((promise) =>
          promise
            .then(() => {
              successes++;
            })
            .catch((e: Error) => {
              fails++;
            })
        );
        return Promise.all(promises).then(() => {
          o(fails).equals(promises.length);
          o(successes).equals(0);
        });
      });
    }

    o('should not reject an object', () =>
      promiseAll({ x: Promise.resolve(1) })
        .then((all) => {
          o(all).deepEquals({ x: 1 });
        })
        .catch(errorOnReject)
    );

    o('should not reject if the input object contains a non promise property', () =>
      promiseAll({ x: 1 })
        .then((all) => {
          o(all).deepEquals({ x: 1 });
        })
        .catch(errorOnReject)
    );
  });

  o.spec('the input is an empty object', () => {
    o('should return a promise', () => {
      o(promiseAll({}) instanceof Promise).equals(true);
    });

    o('should return a promise the resolves to an object', () =>
      promiseAll({})
        .then((all) => {
          o(all).deepEquals({});
        })
        .catch(errorOnReject)
    );
  });

  o.spec('input with promises that should resolve', () => {
    o('should resolve to an object with resolved values instead', () =>
      promiseAll({
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.resolve('result of second promise'),
      })
        .then((all) => {
          o(all).deepEquals({
            firstPromise: 'result of first promise',
            secondPromise: 'result of second promise',
          });
        })
        .catch(errorOnReject)
    );
  });

  o.spec('input with promises that should reject', () => {
    o('should be rejected if at least one of the promises is rejected', () =>
      promiseAll({
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.reject('error in the second promise'),
      })
        .then((all: unknown) => {
          o(all).equals('Promise should have rejected');
        })
        .catch((error) => {
          o(error).equals('error in the second promise');
        })
    );
  });
});
