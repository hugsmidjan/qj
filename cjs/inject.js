'use strict';

var regEscape = require('./regEscape.js');

// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
const _injectRegExpCache = {}; // used by $.inject(); to store regexp objects.

function inject(template, _vars) {
  const _keys = [];
  let l = _vars.length;
  let i;
  let resultString = template;
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
      const _key = _keys[i];
      let re = _injectRegExpCache[_key];
      if ( !re ) {
        re = new RegExp(regEscape('%{'+_key+'}'),'g');
        _injectRegExpCache[_key] = re;
      }
      resultString = resultString.replace(re, _vars[_key]);
    }
  }
  return resultString;
}

module.exports = inject;
