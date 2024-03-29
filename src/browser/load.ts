import addUrlParams from '../url/addUrlParams';
import { ParamsObject } from '../url/makeQueryString';

// Minimal, promise-returning ajax HTTP GET function.
// No bells, whistles, kitchen-plumbing, options, etc.
// Use fetch (w. polyfill) if you need more power).

export default function load(
  url: string,
  params?: ParamsObject /*, opts*/
): Promise<string> {
  if (params) {
    url = addUrlParams(url, params);
  }
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        resolve(request.responseText);
      } else {
        reject();
      }
    };
    request.onerror = () => {
      reject();
    };
    request.send();
  });
}
