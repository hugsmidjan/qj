const getCookie = (name) => {
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

const setCookie = (name, value, options) => {
  options = options || {};
  let expires = (value == null) ? -1 : options.expires;
  if (typeof expires === 'number') {
    expires = new Date( Date.now() + (expires * 24*60*60*1000) );
  }
  value = (value != null) ? value : '';

  document.cookie = (
    name+'=' + encodeURIComponent(value) +
    (expires ? '; expires='+expires.toUTCString() : '') +
    (options.path ? '; path='+options.path : '') +
    (options.domain ? '; domain='+options.domain : '') +
    (options.secure ? '; secure' : '')
  );
};

const cookie = {
  get: getCookie,
  set: setCookie,
};

export {
  getCookie,
  setCookie,
  cookie,
  cookie as default,
};