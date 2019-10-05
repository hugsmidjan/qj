import o from 'ospec';
import splitUrl from './splitUrl';

const hashes = ['cool', encodeURIComponent('kúl'), ''];
const queryStrings = ['foo=1&bar=' + encodeURIComponent('ß'), ''];
const urls = ['https://foo.bar/baz', '/foo/bar/', '/foo/bar', 'baz/bar', ''];

o.spec('splitUrl', () => {
  urls.forEach((url) => {
    queryStrings.forEach((queryString) => {
      hashes.forEach((hash) => {
        const inputs = [
          url,
          url + '#' + hash,
          url + '?' + queryString,
          url + '?' + queryString + '#' + hash,
        ];
        inputs.forEach((input) => {
          o('splits ' + input, () => {
            o(splitUrl(input)).deepEquals({
              url,
              queryString,
              hash,
            });
          });
        });
      });
    });
  });

  o('throws on bad/missing input', () => {
    o(() => {
      // @ts-ignore
      splitUrl();
    }).throws(Error);

    o(() => {
      // @ts-ignore
      splitUrl(42);
    }).throws(Error);
  });
});
