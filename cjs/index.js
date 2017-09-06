'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function A/*::<T>*/(list/*:$Supertype<T[]> */)/*:T[] */ {
  return [].slice.call(list);
}

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map(function (key) {
        var param = paramsObj[key];
        return key +'='+ (param!=null ? encodeURIComponent(param) : '');
      })
      .join('&');
}

function addUrlParams(url, paramsObj) {
  var hashUrl = url.split('#');
  url = hashUrl[0].replace(/\?$/, '');
  var hash = hashUrl[1] ? '#'+hashUrl[1] : '';
  var delim = /\?/.test(url) ? '&' : '?';
  var queryString = makeQueryString(paramsObj);
  return url + (queryString.length ? delim : '') + queryString + hash;
}

if ( typeof window !== 'undefined' && !window.Promise ) {
  // https://github.com/lhorie/mithril.js/blob/next/promise/promise.js
  /* eslint-disable */
  var PromisePolyfill = function(executor) {
    if (!(this instanceof PromisePolyfill)) { throw new Error("Promise must be called with `new`") }
    if (typeof executor !== "function") { throw new TypeError("executor must be a function") }

    var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
    var instance = self._instance = {resolvers: resolvers, rejectors: rejectors};
    var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
    function handler(list, shouldAbsorb) {
      return function execute(value) {
        var then;
        try {
          if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
            if (value === self) { throw new TypeError("Promise can't be resolved w/ itself") }
            executeOnce(then.bind(value));
          }
          else {
            callAsync(function() {
              if (!shouldAbsorb && list.length === 0) { console.error("Possible unhandled promise rejection:", value); }
              for (var i = 0; i < list.length; i++) { list[i](value); }
              resolvers.length = 0, rejectors.length = 0;
              instance.state = shouldAbsorb;
              instance.retry = function() {execute(value);};
            });
          }
        }
        catch (e) {
          rejectCurrent(e);
        }
      }
    }
    function executeOnce(then) {
      var runs = 0;
      function run(fn) {
        return function(value) {
          if (runs++ > 0) { return }
          fn(value);
        }
      }
      var onerror = run(rejectCurrent);
      try {then(run(resolveCurrent), onerror);} catch (e) {onerror(e);}
    }

    executeOnce(executor);
  };
  PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
    var self = this, instance = self._instance;
    function handle(callback, list, next, state) {
      list.push(function(value) {
        if (typeof callback !== "function") { next(value); }
        else { try {resolveNext(callback(value));} catch (e) {if (rejectNext) { rejectNext(e); }} }
      });
      if (typeof instance.retry === "function" && state === instance.state) { instance.retry(); }
    }
    var resolveNext, rejectNext;
    var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject;});
    handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
    return promise
  };
  PromisePolyfill.prototype.catch = function(onRejection) {
    return this.then(null, onRejection)
  };
  PromisePolyfill.resolve = function(value) {
    if (value instanceof PromisePolyfill) { return value }
    return new PromisePolyfill(function(resolve) {resolve(value);})
  };
  PromisePolyfill.reject = function(value) {
    return new PromisePolyfill(function(resolve, reject) {reject(value);})
  };
  PromisePolyfill.all = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
      var total = list.length, count = 0, values = [];
      if (list.length === 0) { resolve([]); }
      else { for (var i = 0; i < list.length; i++) {
        (function(i) {
          function consume(value) {
            count++;
            values[i] = value;
            if (count === total) { resolve(values); }
          }
          if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
            list[i].then(consume, reject);
          }
          else { consume(list[i]); }
        })(i);
      } }
    })
  };
  PromisePolyfill.race = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
      for (var i = 0; i < list.length; i++) {
        list[i].then(resolve, reject);
      }
    })
  };
  /* eslint-enable */
  window.Promise = PromisePolyfill;
}

// Minimal, promise-returning ajax HTTP GET function.
// No bells, whistles, kitchen-plumbing, options, etc.
// Use fetch (w. polyfill) if you need more power).
function load(url, params/*, opts*/) {
  if ( params ) {
    url = addUrlParams(url, params);
  }
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        resolve(request.responseText);
      }
      else {
        reject();
      }
    };
    request.onerror = function () {
      reject();
    };
    request.send();
  });
}

/*
  sortIsl() -- (c) 2014-2017 Hugsmiðjan ehf. - MIT/GPL
  Written by Már Örlygsson - http://mar.anomy.net

  Original at: https://gist.github.com/maranomynet/9972930

  Sorts arrays in Icelandic alphabetical order.
  Accepts an optional function for extracting the property/text to sort by.

  Example usage:

      const arr = ['1','Á','ö','bá','be','$ff','af','að','ad','ý','y'];
      const sortedArr = sortIsl(arr);
      alert( sortedArr.join('\n') );

      // use jQuery to select <tr> elements to sort
      // and convert them to an Array
      const tRows = jQuery('tbody tr').toArray();

      const getSortProp = cellElm => $(cellElm).find('td:eq(1)').text();

      // sort the array in Icelandic alphabetical order
      // by the text-value of each row's second <td> cell.
      const sortedTRows = sortIsl(tRows, getSortProp );
      // or for reverse sorting
      tRows.sortIsl({
        getProp: getSortProp,
        reverse: true
      });

      // or for custom sorting
      tRows.sortIsl({
        getProp: getSortProp,
        sortFn:  function (a,b) { a===b ? 0 : a>b ? 1 : -1; }
      });

      // re-inject the sorted rows into table.
      $(tRows[0].parentNode).append( tRows );

*/
var abcIdx = {};
var abc = '| -0123456789aáàâäåbcdðeéèêëfghiíîïjklmnoóôpqrstuúùüvwxyýÿzþæö'; // prepend list with '|' to guarantee that abc.indexOf(chr) never returns 0 (falsy)
var getAbcText = function (text) {
  if ( typeof text === 'string' ) {
    var idxStr = '';
    text = (text.trim ? text.trim() : text.replace(/^\s+|\s+$/g,''))
              .replace(/[\/.,()]/g, '') // remove punctutation
              .replace(/\s*-\s*/g,'-')  // normalize spacing around dashes
              .replace(/(_|\s)+/g,' ')  // normalize/collapse space-characters
              .toLowerCase();           // lowercase
    var len = text.length;
    var i = 0;
    while ( i < len ) {
      var chr = text.charAt(i);
      var chrCode = abcIdx[chr];
      if ( !chrCode ) {
        var idx = abc.indexOf(chr);
        idx = idx>-1 ? 32+idx : 99+chr.charCodeAt(0);
        chrCode = abcIdx[chr] = String.fromCharCode( idx );
      }
      idxStr += chrCode;
      i++;
    }
    return idxStr;
  }
  return text;
};


function sortIsl( arr, opts ) {
  opts = opts || {};
  if ( typeof opts === 'string' ) {
    var propName = opts;
    opts = { getProp: function (item) { return item[propName]; } };
  }
  else if (opts.apply && opts.call) {
    opts = { getProp: opts };
  }

  var getProp = opts.getProp  ||  (function (item) { return ''+item; });
  var sortFn = opts.sortFn  ||  (function (a,b) { return a[0]===b[0] ? 0 : a[0]>b[0] ? 1 : -1; });

  var tempArr = [];
  var len = arr.length;
  var i = 0;
  while ( i<len ) {
    tempArr[i] = [ getAbcText(getProp( arr[i] )), arr[i] ];
    i++;
  }
  tempArr.sort(
      opts.reverse ?
          function (a,b) { return -1 * sortFn(a,b); }:
          sortFn
    );
  i = 0;
  while ( i<len ) {
    arr[i] = tempArr[i][1];
    i++;
  }
  return tempArr.map();

}

var supportsIcelandic;

var langAliases = {
  no: 'nb', // 'no' doesn't work in Chrome, but 'nb' does
};

function alphabetize(arr, lang, getProp) {
  getProp = getProp || (function (item) { return item; });

  if ( typeof getProp === 'string' ) {
    var prop = getProp;
    getProp = function (item) { return item[prop]; };
  }
  if (
    lang === 'is' &&
    supportsIcelandic == null &&
    (supportsIcelandic = 'ð'.localeCompare('e','is') === -1) === false
  ) {
    return sortIsl( arr, { getProp: getProp } );
  }
  else {
    var newArr = arr.map(function (item, idx) { return ({ value: getProp(item), idx: idx }); });
    lang = langAliases[lang] || lang;
    newArr.sort( function (a,b) {
      return a.value.localeCompare(b.value, lang, {
        sensitivity: 'accent',
        ignorePunctuation: true,
        numeric: true,
      });
    });
    return newArr.map(function (item) { return arr[item.idx]; });
  }
}

// Usage:
//   aquireId();                         // returns a valid unique DOM id string that can be safely assigned to an element.
//   aquireId(prefDefaultIdString);      // returns a valid unique DOM id based on `prefDefaultIdString` (appending/autoincrementing a trailing integer if needed)
//   aquireId(elm);                      // returns the value of elm.id -- automatically assigning a unique id first, if needed.
//   aquireId(elm, prefDefaultIdString); // returns the value of elm.id -- if needed automatically assigning a unique id based on `prefDefaultIdString`.
//

// suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
var _guidPrefix = 'tmp_' + Date.now() + '_';
// a counter that should be incremented with each use.
var _guid = 1;

// aquireId
function aquireId(el, prefDefaultId) { // el is an optional parameter.
  if (typeof el === 'string') {
    prefDefaultId = el;
    el = undefined;
  }
  if ( el ) {
    el = el.nodeType ? el : el[0];
  }
  if (!el || !el.id) {
    var id = prefDefaultId  ||  _guidPrefix + _guid++;
    if (prefDefaultId) {
      var count;
      while ( document.getElementById(id) ) {
        if (count === undefined) {
          var m = prefDefaultId.match(/\d+$/);
          count = m ? parseInt(m[0],10) : 1;
          prefDefaultId = m ? prefDefaultId.replace(/\d+$/, '') : prefDefaultId;
        }
        count++;
        id = prefDefaultId + count;
      }
    }
    if (!el) { return id; }
    if (!el.id) { el.id = id; }
  }
  return el.id;
}

// Prototypal inheritance
var F = function () {};
var hasOwnProperty = Object.prototype.hasOwnProperty;

function beget(proto, props) {
  F.prototype = proto;
  var o = new F();
  if ( props ) {
    for (var key in props) {
      if ( hasOwnProperty.call(props, key) ) {
        o[key] = props[key];
      }
    }
  }
  return o;
}

// Convert arry into an object keyed by prop.
// Prop values are assumed to be unique.
// Array items with repeated keys (prop value) are skipped
function byProp( arr, prop ) {
  var obj = {};
  arr.forEach(function (item) {
    var key = item[prop];
    if ( !(key in obj) ) {
      obj[key] = item;
    }
  });
  return obj;
}

var _EP = Element.prototype;
var _matcher = _EP.matches || _EP.msMatchesSelector || _EP.webkitMatchesSelector || (function () { return false; });

function matches(selector, elm) {
  return _matcher.call(elm, selector);
}

function closestParent(selector/*:string */, elm/*:Node */, stopper/*::?:Element */) {
  var _stopper = stopper || null;
  while ( elm && !matches(selector, elm) && elm !== _stopper ) {
    elm = elm.parentNode;
  }
  return elm === _stopper ? null : elm;
}

var getCookie = function (name) {
  var nameEquals = name+'=';
  var nameLength = nameEquals.length;
  var cookies = document.cookie ? document.cookie.split(/\s*;\s*/) : [];
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    if ( cookie.substr(0, nameLength) === nameEquals ) {
      return decodeURIComponent( cookie.substr(nameLength) );
    }
  }
};

var setCookie = function (name, value, options) {
  options = options || {};
  var expires = (value == null) ? -1 : options.expires;
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

var cookie = {
  get: getCookie,
  set: setCookie,
};

var _reCache = {};

function cropText(str, length, end) {
  end = end || ' ...';
  str = str.trim().replace(/\s+/g, ' ');
  if ( length  &&  str.length > length+end.length ) {
    var hash = length +'~~'+end;
    var re = _reCache[hash] || (_reCache[hash] = new RegExp('^(.{0,'+length+'})\\s.+$'));
    var newTxt = str.replace(re, '$1');
    return newTxt + (newTxt.length<str.length ? end : '');
  }
  return str;
}

/*
  Fast CSS support checker and vendor-prefix resolver
  Returns `false` for unsupported css properties.
  For supported css properties it returns an object with
  the properly vendor-prefixed property-name as both
  JavaScript propertyName and in CSS format.

  Examples of use:
  -------------------------------------

      cssSupport('not-supported-property');
  ==>
      false

      cssSupport('transform-origin');
  ==>
      {
        prop: 'WebkitTransformOrigin',
        css: '-webkit-transform-origin'
      }

      cssSupport('transform-origin');
  ==>
      {
        prop: 'WebkitTransformOrigin',
        css: '-webkit-transform-origin'
      }

*/
var cache = {};
var elmStyles;
var vendorsJs = ['Khtml','O','Ms','Moz','Webkit'];
var vendorsCss = ['-khtml-','-o-','-ms-','-moz-','-webkit-'];

function cssSupport( propname ) {
    // lazy initalize elmStyle
    elmStyles = elmStyles || document.createElement('div').style;

    var prop = cache[propname];
    // If this is the first time we're asked about propname
    if ( prop === undefined ) {
      var cssProp;
      var jsProp;
      // Convert propname from CSS style `transform-origin`
      // into JavaScript-style `transformOrigin`
      var PropName = propname.replace(/-([a-z])/g, function (val, chr) { return chr.toUpperCase(); });
      if ( PropName in elmStyles ) {
        // Un-prefixed property is supported!
        jsProp = PropName;
        cssProp = propname;
      }
      else {
        // Capitalize PropName in preparation for vendor-prefixing
        // (i.e. from `transformOrigin` to `TransformOrigin`
        PropName = PropName.replace(/^[a-z]/, function (chr) { return chr.toUpperCase(); });
        var i = vendorsJs.length;
        while (i--) {
          var PrefixedProp = vendorsJs[i] + PropName;
          if ( PrefixedProp in elmStyles ) {
            // Vendor-prefixed property is supported
            jsProp = PrefixedProp;
            cssProp = vendorsCss[i] + propname;
            break;
          }
        }
      }
      // Build the property-name object.
      prop = jsProp ? { prop: jsProp,  css: cssProp } : false;
      // Cache the results
      cache[propname] = prop;
    }
    return prop;
  }

// Super simple minimal currier
function curry(func) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  return function () {
    var args2 = [], len = arguments.length;
    while ( len-- ) args2[ len ] = arguments[ len ];

    return func.apply(this, args.concat(args2));
  };
}

// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
function debounce(func, delay, immediate) {
  if ( typeof delay === 'boolean' ) {
    immediate = delay;
    delay = 0;
  }
  delay = delay || 50;
  var timeout;
  var debouncedFn = !immediate ?
      // simple delayed function
      function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(_this, args);
        }, delay);
      }:
      // more complex immediately called function
      function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var runNow = !timeout && immediate;
        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          !runNow  &&  func.apply(_this, args); // don't re-invoke `func` if runNow is true
          timeout = 0;
        }, delay);
        runNow  &&  func.apply(_this, args);
      };
  debouncedFn.cancel = function () {
    clearTimeout(timeout);
    timeout = 0;
  };
  return debouncedFn;
}

var domid_prefix = '_' + /*@__PURE__*/(Date.now()+'-').substr(6);
var domid_incr = 0;

function domid()/*: string */ {
  return domid_prefix + (domid_incr++);
}

// Hyperscript function that spits out DOM nodes.
function E(tagName, attrs) {
  var children = [], len = arguments.length - 2;
  while ( len-- > 0 ) children[ len ] = arguments[ len + 2 ];

  var elm = document.createElement(tagName);
  if (attrs) {
    for (var name in attrs) {
      var value = attrs[name];
      if ( value != null ) {
        if ( name === 'style' ) {
          for (var cssProp in value) {
            elm.style[cssProp] = value[cssProp];
          }
        }
        else if ( name in elm ) {
          elm[name] = value;
        }
        else if ( (/^on[A-Z]/).test(name) ) {
          // onEventtype: fn => elm.addEventListener('eventtype', fn)
          elm.addEventListener(name.substr(2).toLowerCase(), value);
        }
        else if ( name.charAt(0) === '_' ) {
          // _propName: value => elm.propName = value;
          elm[name.substr(1)] = value;
        }
        else {
          // default to setAttribute()
          elm.setAttribute(name, value);
        }
      }
    }
  }
  var _appendChildren = function (child) {
    if ( child instanceof Array ) {
      child.forEach(_appendChildren);
    }
    else if ( child || child === 0 ) {
      if ( !(child instanceof Node) ) {
        child = document.createTextNode( child );
      }
      elm.appendChild( child );
    }
  };
  children.forEach(_appendChildren);

  return elm;
}

/*
  Add a simple chainable `.on()`, `.off()`, `.emit()` interface to any object.

  Example usage:
  --------------

      const app = {};
      eventify( app );


  1) Emit named event:

      app.on('foo', () => doStuff());
      //...
      app.emit('foo');


  2) Emit event object with type as a property:

      app.on('foo2', (event) => doStuff(event.target));
      //...
      app.emit({ type: 'foo2', target: targObj });


  3) Emit named event with extra parameters:

      app.on('bar', (some, data) => use(some, data));
      //...
      app.emit('bar' 'whatever', someObj);


  4) Emit event object (with .type prop), along with extra parameters:

      app.on('baz', (event, some, data) => use(event.target, some, data));
      //...
      app.emit({ type: 'baz', target: targObj }, 'whatever', someObj);

*/
function eventify(object) {

  var events = {};

  object.on = function (eventName, callback) {
    if ( callback ) {
      var callbackList = events[eventName];
      if ( !callbackList ) {
        callbackList = events[eventName] = [];
      }
      if ( callbackList.indexOf( callback ) === -1 ) {
        callbackList.push( callback );
      }
    }
    return this;
  };

  object.off = function (eventName, callback) {
    var numArgs = arguments.length;
    if ( !numArgs ) {
      events = {};
    }
    else if ( numArgs === 1 ) {
      delete events[eventName];
    }
    else if ( callback ) {
      var callbackList = events[eventName] || [];
      var idx = callbackList.indexOf( callback );
      if ( idx > -1 ) {
        callbackList.splice( idx, 1 );
      }
    }
    return this;
  };


  object.emit = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var firstArg = args[0];
    var evType;
    if ( typeof firstArg === 'string' ) {
      evType = args.shift();
    }
    else if ( firstArg ) {
      evType = firstArg.type;
    }
    if ( evType != null ) {
      (events[evType] || [])
          .slice() // clone to prevent callbacks adding to the queue in mid-air
          .forEach(function (callback) {
            callback.apply(null, args);
          });
    }
    return this;
  };

  return object;

}

// Sets the document.location.hash while suppressing the viewport scrolling
// Accepts a plaintext fragment - and URI encodes it automatically - unless the `_isEncoded` flag is set.
// Usage:
//   setFrag('myid');
//   setFrag('#myid');
//   setFrag('Fraîce 18%');
//   setFrag('Fra%C3%AEce%2018%25', true);
//   setFrag('');    // unset
//   setFrag(null);  // unset

var setFrag = function (_fragment, _isEncoded) {
  _fragment = (_fragment||'').replace(/^#/, '');
  // check if there exists an element with .id same as _fragment
  var _elm = _fragment  &&  document.getElementById( _isEncoded ? decodeURIComponent(_fragment) : _fragment );
  // var _prePos = !_fragment  &&  $.scrollTop();
  var _prePos = document.body.scrollTop||document.documentElement.scrollTop;
  var _tmpId = _elm && _elm.id;

  // temporaily defuse the element's id
  _elm  &&  (_elm.id = '');

  // set the damn hash... (Note: Safari 3 & Chrome barf if frag === '#'.)
  document.location.hash = (_isEncoded ? _fragment : encodeFrag(_fragment) );

  // Always reset scrollpos
  // (because Chrome ~v34 seems to scroll to the element which had -
  // that ID on page load regardless of wheter its id has changed
  // or if another element has now received that id. weird.)
  window.scrollTo( 0, _prePos);

  // put the old DOM id back in it's place
  _elm  &&  (_elm.id = _tmpId);
};


// encodes a plain-text string to a URL #fragment friendly format (compatible with .get())
var encodeFrag = function (_fragment) {
  return encodeURI(_fragment).replace(/#/g, '%23').replace(/%7C/g, '|');
};


// returns the #fragment portion of `url` (defaulting to using `document.location.href`)
// returns a plaintext (decodeURIComponent) version of the fragment - unless a `_returnRaw` argument is passed.
var getFrag = function (url, _returnRaw) {
  var _fragment = ( url || document.location.href ).split('#')[1] || '';
  return _returnRaw ? _fragment : decodeURIComponent(_fragment);
};


var frag = {
  get: getFrag,
  set: setFrag,
  encode: encodeFrag,
};

var _paramREs = {};

function getUrlParam(name, url) {
  var re = _paramREs[name];
  if ( !re ) {
    var safeName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    re = new RegExp('(?:^|&)'+safeName+'=([^&]+)');
    _paramREs[name] = re;
  }
  url = url ? url.split('#')[0].split('?')[1] : document.location.search.substr(1);
  return (re.exec(url)||[])[1];
}

function htmlToDiv(html, opts) {
  var div = document.createElement('div');
  div.innerHTML = String(html)
      .replace(/<\!DOCTYPE[^>]*>/i, '')
      .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))/gi, function (m,p1,p2) {
        return p1 + (opts && !opts['keep'+p2.toLowerCase()] ? '' : '--disabled');
      });
  return div;
}

function htmlToNodes(html, opts) {
  return A( htmlToDiv(html, opts).childNodes );
}

function regEscape(s) {
  return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
}

// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
var _injectRegExpCache = {}; // used by $.inject(); to store regexp objects.

function inject(template, _vars) {
  var _keys = [];
  var l = _vars.length;
  var i;
  var resultString = template;
  // fail early to save time
  if ( resultString.indexOf('%{') > -1 ) {
    // NOTE: this is a fairly ugly way to collect the "keys" depending on if _vars is a List or an Object.
    if (isNaN(l)) {
      for (i in _vars) { _keys.push(i); }
    }
    else {
      while (l--) { _keys.push(l); }
    }
    // now loop through the _keys and perform the replacement
    i = _keys.length;
    while (i--) {
      var _key = _keys[i];
      var re = _injectRegExpCache[_key];
      if ( !re ) {
        re = new RegExp(regEscape('%{'+_key+'}'),'g');
        _injectRegExpCache[_key] = re;
      }
      resultString = resultString.replace(re, _vars[_key]);
    }
  }
  return resultString;
}

// liveVal
// update input/textarea values while maintaining cursor-position *from end*
function liveVal(input, value) {
  var delta = value.length - input.value.length;
  var selStart = input.selectionStart + delta;
  var selEnd = input.selectionEnd + delta;
  input.value = value;
  if ( input.setSelectionRange ) {
    input.setSelectionRange(selStart, selEnd);
  }
}

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
function onNext(periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var msToNext = periodSizeMS - (Date.now() - offsetMs) % periodSizeMS;
  // add a slight .5% - 1% fuzz to the timer to avoid
  // A) crazy spikes in server-load (in case of multiple clients)
  // B) accidental under-shoots caused by bad timer handling in the browser
  var fuzz = (1 + Math.random()) * Math.max(.01*periodSizeMS, 100);
  var timeout = setTimeout(callback, msToNext + fuzz);

  var canceller = function (execCallback) {
    clearTimeout(timeout);
    execCallback && callback();
  };
  return canceller;
}

// Same as `onNext()` except auto-repeating
function onEvery(periodSizeMS, offsetMs, callback) {
  var canceller;
  var callbackOnNext = function () {
    canceller = onNext(periodSizeMS, offsetMs, function () {
      callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  var cancellerProxy = function (execCallback) { return canceller(execCallback); };
  return cancellerProxy;
}

// parseParams( queryString )
//
// Convert queryString type Strings into a neat object
// where each named value is an Array of URL-decoded Strings.
// Defaults to parsing the current document URL if no paramString is passed.
//
// Example:
//    var obj = parseParamS( "?foo=1&=bar&baz=&foo=2&" );
//      ==>  {  'foo':['1','2'],  '':['bar'],  'baz':['']  }
//    var obj = parseParamS( "" );
//      ==>  { }
function parseParams(paramString) {
  var map = {};
  paramString = ( paramString!=null ? paramString : document.location.search )
                    .trim()
                    .replace(/^[?&]/, '')
                    .replace(/&$/, '');
  if ( paramString ) {
    paramString
        .replace(/\+/g, ' ')
        .split('&')
        .forEach(function (paramBit) {
          var ref = paramBit.split('=');
          var name = ref[0];
          var value = ref[1];
          name = decodeURIComponent(name);
          var values = map[name] || (map[name] = []);
          values.push( decodeURIComponent(value||'') );
        });
  }
  return map;
}

function q(selector/*:string */, root/*::?:Root */)/*:Element|null*/ {
  return (!selector || root===null) ? null : (root||document).querySelector(selector);
}

var A$1 = [].slice;

function qq(selector/*:string */, root/*::?:Root */)/*:Element[] */ {
  return (!selector || root===null) ? [] : A$1.call((root||document).querySelectorAll(selector));
}

// reenable selected HTML elements that were disbbled by htmlToDiv()
function reenableElms(elm, tagName) {
  var disabledTagName = tagName + '--disabled';
  var re = new RegExp('(<\\/?'+ tagName +')--disabled([ >])', 'gi');
  var enable = function (elm) {
    elm.outerHTML = elm.outerHTML.replace(re, '$1$2');
  };
  if ( elm.tagName.toLowerCase() === disabledTagName ) {
    enable(elm);
  }
  // Since none of the elements disabled by htmlToDiv() may be nested
  // we can assume this is an either or case.
  else {
    qq(disabledTagName, elm).forEach(enable);
  }
  return elm;
}

function reloadPage(url) {
  var _docLoc = document.location;
  var _docHref = _docLoc.href;
  url = url || _docHref;
  // juggling ?/& suffixes is neccessary to 100% guarantee a reload.
  if ( url === _docHref ) {
    var blah =  !/\?/.test(url) ?
                    '?':
                  !/[&?](?:#|$)/.test(url) ?
                    '&':
                    '';
    url = url.replace(/[&?]?(#.*)?$/, blah+'$1');
  }
  _docLoc.replace( url );
}

function removeNode(node/*:Node */) {
  node && node.parentNode && node.parentNode.removeChild( node );
  return node;
}

function replaceNode(node, newNode) {
  node && node.parentNode && node.parentNode.replaceChild(newNode, node);
  return node;
}

// shuffle the contents of an array
function shuffle(array, mutate) {
  array = mutate ? [].slice.call(array) : array;
  var left = array.length;
  while (left) {
    var p = Math.floor( left * Math.random(left--) );
    var t = array[left];
    array[left] = array[p];
    array[p] = t;
  }
  return array;
}

// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
function throttle(func, delay, skipFirst) {
  if ( typeof delay === 'boolean' ) {
    skipFirst = delay;
    delay = 0;
  }
  delay = delay || 50;
  var throttled = 0;
  var timeout;
  var _args;
  var _this;
  var throttledFn = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    _args = args;
    _this = this;
    if (!throttled) {
      skipFirst ?
          throttled++:
          func.apply(_this, _args);
      timeout = setTimeout(throttledFn.finish, delay);
    }
    throttled++;
  };
  throttledFn.finish = function () {
    clearTimeout( timeout );
    throttled>1 && func.apply(_this, _args);
    throttled = 0;
  };
  return throttledFn;
}

function trigger(type, elm) {
  var e = new Event(type);
  elm.dispatchEvent( e );
}

function uniqueArray(array) {
  var result = [];
  var length = array.length;
  for (var i = 0; i < length; i++) {
    var value = array[i];
    if ( result.indexOf(value) < 0 ) {
      result.push(value);
    }
  }
  return result;
}

function zapElm(elm) {
  var parent = elm && elm.parentNode;
  if ( parent ) {
    while ( elm.firstChild ) {
      parent.insertBefore(elm.firstChild, elm);
    }
    parent.removeChild(elm);
  }
}

// coderjoe zero padding for numbers - http://jsperf.com/left-zero-pad/18
function zeroPad(number, width) {
  var num = Math.abs(number);
  var zeros = Math.max(0, width - Math.floor(num).toString().length );
  zeros = Math.pow(10,zeros).toString().substr(1);
  return (number<0 ? '-' : '') + zeros + num;
}

exports.A = A;
exports.addUrlParams = addUrlParams;
exports.load = load;
exports.alphabetize = alphabetize;
exports.aquireId = aquireId;
exports.beget = beget;
exports.byProp = byProp;
exports.closestParent = closestParent;
exports.cookie = cookie;
exports.getCookie = getCookie;
exports.setCookie = setCookie;
exports.cropText = cropText;
exports.cssSupport = cssSupport;
exports.curry = curry;
exports.debounce = debounce;
exports.domid = domid;
exports.E = E;
exports.eventify = eventify;
exports.frag = frag;
exports.getFrag = getFrag;
exports.setFrag = setFrag;
exports.encodeFrag = encodeFrag;
exports.getUrlParam = getUrlParam;
exports.htmlToDiv = htmlToDiv;
exports.htmlToNodes = htmlToNodes;
exports.inject = inject;
exports.liveVal = liveVal;
exports.makeQueryString = makeQueryString;
exports.matches = matches;
exports.onEvery = onEvery;
exports.onNext = onNext;
exports.parseParams = parseParams;
exports.q = q;
exports.qq = qq;
exports.reenableElms = reenableElms;
exports.regEscape = regEscape;
exports.reloadPage = reloadPage;
exports.removeNode = removeNode;
exports.replaceNode = replaceNode;
exports.shuffle = shuffle;
exports.throttle = throttle;
exports.trigger = trigger;
exports.uniqueArray = uniqueArray;
exports.zapElm = zapElm;
exports.zeroPad = zeroPad;
