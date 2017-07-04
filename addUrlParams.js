import makeQueryString from './makeQueryString';

export default function addUrlParams(url, paramsObj) {
  const hashUrl = url.split('#');
  url = hashUrl[0].replace(/\?$/, '');
  const hash = hashUrl[1] ? '#'+hashUrl[1] : '';
  const delim = /\?/.test(url) ? '&' : '?';
  const queryString = makeQueryString(paramsObj);
  return url + (queryString.length ? delim : '') + queryString + hash;
}
