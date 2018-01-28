'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// List-to-Array converter
function A/*::<T>*/(list/*:$Supertype<T[]> */)/*:T[] */ {
  return [].slice.call(list);
}

function makeQueryString(paramsObj) {
  return Object.keys(paramsObj)
      .map(function (key) {
        var param = paramsObj[key];
        return (param!=null ? key+'='+encodeURIComponent(''+param) : '');
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


var defaultGetProp = function (item) { return item+''; };
var defaultSortFn = function (a,b) { return a[0]===b[0] ? 0 : a[0]>b[0] ? 1 : -1; };

function sortIsl( arr, opts ) {
  opts = opts || {};
  if ( typeof opts === 'string' ) {
    var propName = opts;
    opts = { getProp: function (item) { return item[propName]; } };
  }
  else if (opts.apply && opts.call) {
    opts = { getProp: opts };
  }
  var getProp = opts.getProp  ||  defaultGetProp;
  var sortFn = opts.sortFn  ||  defaultSortFn;
  return arr
      .map(function (itm) { return [ getAbcText(getProp(itm)), itm ]; })
      .sort(opts.reverse ? function (a,b) { return -1*sortFn(a,b); } : sortFn)
      .map(function (itm) { return itm[1]; });
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
    lang !== 'is' || supportsIcelandic === true ||
    (supportsIcelandic !== false && !!(supportsIcelandic = 'ð'.localeCompare('e','is') < 0 && 'ob'.localeCompare('öa','is') < 0))
  ) {
    var newArr = arr.map(function (item, idx) { return ({ value: ''+getProp(item), idx: idx }); });
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
  else {
    return sortIsl( arr, { getProp: getProp } );
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

// Convert an array-like list into an object keyed by prop.
// Prop values are assumed to be unique.
// Array items with repeated keys (prop value) are skipped
// If prop is undefined, the Array values are used as keys
// with the value being a count of how many times each key occured
/*
  const arr1 = [
    {name:'Tim', age:12},
    {name:'Sam', age:10},
    {name:'Tim', age:29},
  ];
  console.log( arrayToObject(arr1, 'name') );
  // { Tim:{name:'Tim',age:12}, Sam:{name:'Sam',age:10} };

  const arr2 = ['Orange', 'Apple', 'Tomato', 'Apple', 'Apple'];
  console.log( arrayToObject(arr2) );
  // { Orange:1, Apple:3, Tomato:1 }

*/
function arrayToObject( list, prop ) {
  if ( list ) {
    var obj = {};
    [].forEach.call(list, prop ?
      function (item) {
        var key = item[prop];
        if ( !(key in obj) ) {
          obj[key] = item;
        }
      }:
      function (item) {
        obj[item] = (obj[item] || 0) +1;
      }
    );
    return obj;
  }
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

var _matcher;
function matches(selector, elm) {
  if ( _matcher == null ) {
    _matcher = elm.matches || elm.msMatchesSelector || elm.webkitMatchesSelector || (function () { return false; });
  }
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
var debounce = function (func, delay, immediate) {
  var timeout;
  var debouncedFn = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var runNow = immediate && !timeout;
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
};

// Sugar to produce a debounced function
// that accepts its contents/behavior at call time.
// Usage:
//     const myDebouncer = debounce.d(500);
//     myDebouncer(() => { alert('Hello world'); });
//     myDebouncer(() => { alert('I mean: Howdy world!'); });
debounce.d = function (delay, immediate) { return debounce(function (fn) { return fn(); }, delay, immediate); };

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

      app.on('bar', (some, data) => use(some.toUpperCase(), data));
      //...
      app.emit('bar', 'whatever', someProps);


  4) Emit event object (with .type prop), along with extra parameters:

      app.on('baz', (event, some, data) => use(event.target, some.toUpperCase(), data));
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

// DECIDE: Add support for custom find function?
//   (where the default would be the identity function)
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

// Convert an array-like list into an object containing the items
// grouped by some `prop` – where `prop` can be a custom function
var groupBy = function (list, prop) {
    var getProp = typeof prop === 'string' ?
        function (item) { return item[prop]; }:
        prop;

    var grouped = {};

    [].forEach.call(list, function (item) {
        var name = getProp(item);
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(item);
    });

    return grouped;
};

groupBy.asArray = function (list, prop) {
    var grouped = groupBy(list, prop);
    return Object.keys(grouped).map(function (name) { return ({
        name: name,
        items: grouped[name],
    }); });
};

var list = {
    A: A,
    toArray: A,
    alphabetize: alphabetize,
    toObject: arrayToObject,
    dedupe: uniqueArray,
    groupBy: groupBy,
};

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

// Functional Immutability helpers.
// --------------------------------------------------------
// Small, fast, stupid, practical, & care-free.
// False-positives (like NaN and 0 v -0) considered acceptable.

// NOTE: All of the methods should be safe for Arrays too
// ...while perhaps not optimally performant in all cases.

// INFO: Interesting 3rd party deep equals helpers.
//  * https://github.com/ReactiveSets/toubkal/blob/master/lib/util/value_equals.js
//    (https://github.com/ReactiveSets/toubkal/blob/1b73baf288385b34727ddf6d223f62c3bb2cb176/lib/util/value_equals.js)
//  * https://github.com/lodash/lodash/blob/es/_baseIsEqual.js
//   (https://github.com/lodash/lodash/blob/f71a7a04b51bd761683e4a774c5b1d38bdaa7b20/_baseIsEqual.js)

// import './polyfills/Object.assign';

// IE11 compatible no-polyfill object cloner
var _clone = function (original) {
  var clone = new original.constructor();
  for (var originalKey in original) {
    if ( hasOwnProperty$1.call(original, originalKey) ) {
      clone[originalKey] = original[originalKey];
    }
  }
  return clone;
};
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;



// Returns a clone of original object with only the changed newValues assigned
// Returns the original if nothing changed.
var objectUpdate = function (original, newValues, customSameCheck) {
  var clone;
  for (var key in newValues) {
    var valA = original[key];
    var valB = newValues[key];
    if (
      valA !== valB  &&  hasOwnProperty$1.call(newValues, key)  &&
      !(customSameCheck && valA && valB && customSameCheck(valA, valB, key))
    ) {
      // Fast IE11 compatible no-polyfill version
      clone = clone || _clone(original);
      clone[key] = newValues[key];
      // // Modern
      // clone = Object.assign({}, original, newValues);
      // break;
      // // Ultra modern
      // clone = { ...original, ...newValues };
      // break;
    }
  }
  return clone || original;
};


// Returns a clone of original object with all keys that have undefined values deleted
// Returns the original if nothing changed.
var objectClean = function (original, alsoNull) {
  var deleted;
  var clone = new original.constructor();
  for (var key in original) {
    if ( hasOwnProperty$1.call(original, key) ) {
      var originalVal = original[key];
      if ( (originalVal === undefined) || (originalVal === null && alsoNull) ) {
        deleted = true;
      }
      else {
        clone[key] = originalVal;
      }
    }
  }
  return deleted ? clone : original;
};


// Returns true if object as no properties of its own
var objectIsEmpty = function (object) {
  for (var key in object) {
    if ( hasOwnProperty$1.call(object, key) ) {
      return false;
    }
  }
  return true;
};


// Returns true if objects a and b contain 100% the same values.
var objectIsSame = function (a, b, customSameCheck) {
  if (typeof a.length === 'number' && a.length !== b.length) {
    return false;
  }
  var encountered = {};
  for (var key in b) {
    var valA = a[key];
    var valB = b[key];
    if (
      valA !== valB  &&  hasOwnProperty$1.call(b, key)  &&
      !(customSameCheck && valA && valB && customSameCheck(valA, valB, key))
    ) {
      return false;
    }
    encountered[key] = true;
  }
  for (var key$1 in a) {
    if ( !encountered[key$1] ) {
      return false;
    }
  }
  return true;
};


// Returns a clone of original object with only the specified keys
// Returns the original if nothing changed.
var objectOnly = function (original, keys) {
  var extra;
  var clone = new original.constructor();
  for (var key in original) {
    if ( hasOwnProperty$1.call(original, key) ) {
      if ( keys.indexOf(key) > -1 ) {
        clone[key] = original[key];
      }
      else {
        extra = true;
      }
    }
  }
  return extra ? clone : original;
};


// Returns a clone of original object without the specified keys
// Returns the original if nothing changed.
var objectWithout = function (original, keys) {
  var clone;
  var numKeys = keys.length;
  for (var i=0; i<numKeys; i++) {
    var key = keys[i];
    if ( hasOwnProperty$1.call(original, key) ) {
      // Fast IE11 compatible no-polyfill version
      clone = clone || _clone(original);
      // // Modern
      // clone = clone || Object.assign({}, original);
      // // Ultra modern
      // clone = clone || { ...original };
      delete clone[key];
    }
  }
  return clone || original;
};


// Returns original if replacement has the same keys + values.
// Otherwise returns replacement as is.
var objectReplace = function (original, replacement, customSameCheck) {
    return  objectIsSame(original, replacement, customSameCheck) ?
                original:
                replacement;
};



var object = {
  clean: objectClean,
  isEmpty: objectIsEmpty,
  isSame: objectIsSame,
  only: objectOnly,
  replace: objectReplace,
  update: objectUpdate,
  without: objectWithout,
};

var SECOND = 1000;
var MINUTE = 60000;
var HOUR = 3600000;
var DAY = 86400000;
/*
  Super fast mini-helpers to find start/end of certain periods within the `timestamp` day.
  Done without using any expensive `Date` operations.
  Useful for setting timers/timeouts.

  Usage:
      const unixDate = 1486289500131; // some random Date.

      const ms_at_start_of_Day = atLast(unixDate, DAY);
      const ms_at_start_of_Hour = atLast(unixDate, HOUR);
      const ms_at_start_of_12hourPeriod = atLast(unixDate, 12*HOUR);
      const ms_at_end_of_Day = atNext(unixDate, DAY);
      const ms_at_end_of_30MinutePeriod = atNext(unixDate, 30*MINUTE);
      const ms_since_last_midnight = sinceLast(unixDate, DAY);
*/

var sinceLast = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp >= 0 ?
      timestamp % periodSizeMS:
      (periodSizeMS + timestamp % periodSizeMS) % DAY;
};
var untilNext = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return periodSizeMS - sinceLast(timestamp, periodSizeMS);
};

var atLast = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  return timestamp - sinceLast(timestamp, periodSizeMS);
};
var atNext = function (timestamp, periodSizeMS) {
  // if ( timestamp.getTime ) { timestamp = timestamp.getTime(); }
  // return timestamp + untilNext(timestamp, periodSizeMS);
  return timestamp + (periodSizeMS - sinceLast(timestamp, periodSizeMS));
};




/*
  Executes callback when the clock strikes the next whole `periodSizeMs`
  Returns an object with a `cancel` function - which optionally executes the callback.

  Usage:
      const MINUTE = 60*1000;
      const HOUR = 60*MINUTE;

      // Log the current time when the clock strikes next noon or midnight.
      const at12 = onNext(12*HOUR, () => console.log(Date()) );

      // Log the current time 15 minutes after the clock strikes next noon or midnight.
      const at12_15 = onNext(12*HOUR, 15*MINUTE, () => console.log(Date()) );

      // Cancel the 12 o'clock callback:
      at12.cancel();

      // Nevermind the 12:15 schedule. Run the callback right now!
      at12_15.cancel(true);

*/
var onNext = function (periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var msToNext = untilNext(Date.now(), periodSizeMS) + offsetMs;
  // OPINIONATED: Add a slight .5% - 1% fuzz to the timer to avoid
  // A) crazy spikes in server-load (in case of multiple clients)
  // B) accidental under-shoots caused by bad timer handling in the browser
  var fuzz = (1 + Math.random()) * Math.max(.01*periodSizeMS, 100);
  var timeout = setTimeout(callback, msToNext + fuzz);

  return {
    cancel: function (execCallback) {
      clearTimeout(timeout);
      execCallback && callback();
    },
  };
};

// Auto-repeating version of `onNext()`
var onEvery = function (periodSizeMS, offsetMs, callback) {
  if (typeof offsetMs !== 'number') {
    callback = offsetMs;
    offsetMs = 0;
  }
  var nextUp;
  var callbackOnNext = function () {
    nextUp = onNext(periodSizeMS, offsetMs, function () {
      callback();
      callbackOnNext();
    });
  };
  callbackOnNext();
  return {
    cancel: function (execCallback) { nextUp.cancel(execCallback); },
  };
};



var time = {
  SECOND: SECOND,
  MINUTE: MINUTE,
  HOUR: HOUR,
  DAY: DAY,

  sinceLast: sinceLast,
  untilNext: untilNext,
  atLast: atLast,
  atNext: atNext,
  atStart: atLast,
  atEnd: atNext,

  onNext: onNext,
  onEvery: onEvery,
};

console.warn('Module "qj/onEvery" is depricated.\n `import { onEvery } from "qj/time";` instead.');

console.warn('Module "qj/onNext" is depricated.\n `import { onNext } from "qj/time";` instead.');

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

// Searches for `terms` in the `prop`s of the `items` Array
// Returns a filtered array sorted according by how well the items matched the `term`
var textSearch = function (props) {
  var items = props.items;
  var term = props.term;
  var prop = props.prop;
  var normalized = props.normalized;

  term = term.trim();
  if ( !term ) {
    return items;
  }
  var terms = term.toLowerCase().split(/\s+/);
  var results = [];
  items.forEach(function (item, idx) {
    var searchText =  !prop ?
                          item:
                      prop.apply ?
                          prop(item):
                          item[prop];
    if ( !normalized ) {
      searchText = normalizeText(searchText);
    }
    searchText = ' '+searchText+' ';
    var score = 0;
    terms.forEach(function (fragment) {
      var pos = searchText.indexOf(fragment);
      if ( pos > 0 ) {
        var startsWith = pos === 1;
        var wordStart = startsWith || searchText.charAt(pos - 1) === ' ';
        var wholeWord = wordStart  &&  searchText.charAt(pos + fragment.length) === ' ';
        score +=  wholeWord && startsWith ? 10000 :
                  wholeWord ? 1000 :
                  startsWith ? 100 :
                  wordStart ? 10 :
                  1;
      }
    });
    if ( score > 0 ) {
      results.push({ item: item, score: score, idx: idx });
    }
  });
  results.sort(function (a,b) {
    return  a.score < b.score ? 1:
            a.score > b.score ? -1:
            a.idx < b.idx ? -1 : 1; // fix Chrome's unstable sort
  });
  return results.map(function (result) { return result.item; });
};


// Helper function to prepare a String for the search function
var normalizeText = function (string) {
  return (string.join ? string.join(' ') : string)
              .replace(/\u00ad/g, '') // remove soft-hyphens
              .replace(/[\s\-–—_.,@]+/g, ' ') // normalize spaces
              .trim()
              .toLowerCase();
};
textSearch.normalize = normalizeText;

// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
var throttle = function (func, delay, skipFirst) {
  var timeout;
  var throttled = 0;
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
};

function trigger(type, elm) {
  var e = new Event(type);
  elm.dispatchEvent( e );
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
exports.alphabetize = alphabetize;
exports.aquireId = aquireId;
exports.arrayToObject = arrayToObject;
exports.beget = beget;
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
exports.list = list;
exports.liveVal = liveVal;
exports.load = load;
exports.makeQueryString = makeQueryString;
exports.matches = matches;
exports.object = object;
exports.objectClean = objectClean;
exports.objectIsEmpty = objectIsEmpty;
exports.objectIsSame = objectIsSame;
exports.objectOnly = objectOnly;
exports.objectReplace = objectReplace;
exports.objectUpdate = objectUpdate;
exports.objectWithout = objectWithout;
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
exports.textSearch = textSearch;
exports.throttle = throttle;
exports.time = time;
exports.trigger = trigger;
exports.uniqueArray = uniqueArray;
exports.zapElm = zapElm;
exports.zeroPad = zeroPad;
