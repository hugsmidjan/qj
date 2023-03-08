import o from 'ospec';

import splitUrl, { UrlComponents } from './splitUrl';

const urls = ['https://foo.bar/baz', '/foo/bar/', '/foo/bar', 'baz/bar', ''];
const queryStrings = ['foo=1&bar=' + encodeURIComponent('ß'), ''];
const hashes = ['cool', encodeURIComponent('kúl'), ''];

const assert = (input: string, { url, queryString, hash }: UrlComponents) =>
  o('splits ' + input, () => {
    o(splitUrl(input)).deepEquals({
      url,
      queryString,
      hash,
    });
  });

o.spec('splitUrl', () => {
  urls.forEach((url) => {
    assert(url, {
      url,
      queryString: '',
      hash: '',
    });
    queryStrings.forEach((queryString) => {
      assert(url + '?' + queryString, {
        url,
        queryString,
        hash: '',
      });
    });
    hashes.forEach((hash) => {
      assert(url + '#' + hash, {
        url,
        queryString: '',
        hash,
      });
      queryStrings.forEach((queryString) => {
        assert(url + '?' + queryString + '#' + hash, {
          url,
          queryString,
          hash,
        });
      });
    });
  });

  o('throws on bad/missing input', () => {
    o(() => {
      // @ts-expect-error  (testing invalid input)
      splitUrl();
    }).throws(Error);

    o(() => {
      // @ts-expect-error  (testing invalid input)
      splitUrl(42);
    }).throws(Error);
  });
});
