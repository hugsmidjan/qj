type hours = number;

const getCookie = (name: string): string | undefined => {
  const nameEquals = name+'=';
  const nameLength = nameEquals.length;
  const cookies = document.cookie ? document.cookie.split(/\s*;\s*/) : [];
  for (var i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    if ( cookie.substr(0, nameLength) === nameEquals ) {
      return decodeURIComponent( cookie.substr(nameLength) );
    }
  }
};

// setCookie(name, null) deletes a cookie
/**
 * Set cookie.
 *
 * Setting value to `null|undefined` or `expires: -1` deletes a cookie
*/
function setCookie (
  name: string,
  value: string | number | boolean,
  options?: {
    expires?: hours | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
  }
): void;

/**
 * Delete cookie.
*/
function setCookie (
  name: string,
  value: null | undefined,
  options?: {
    expires?: -1;
    path?: string;
    domain?: string;
    secure?: boolean;
  }
): void;

function setCookie(
  name: string,
  value: string | number | boolean | null | undefined,
  options?: {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
  }
): void {
  options = options || {};
  let expires = (value == null) ? -1 : options.expires;
  if (typeof expires === 'number') {
    expires = new Date( Date.now() + (expires * 24*60*60*1000) );
  }
  value = (value == null) ? '' : value;

  document.cookie = (
    name+'=' + encodeURIComponent(value) +
    (expires ? '; expires='+expires.toUTCString() : '') +
    (options.path ? '; path='+options.path : '') +
    (options.domain ? '; domain='+options.domain : '') +
    (options.secure ? '; secure' : '')
  );
}

const cookie = {
  get: getCookie,
  set: setCookie,
};

export {
  getCookie,
  setCookie,

  cookie as default,
};
