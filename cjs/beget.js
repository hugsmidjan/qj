'use strict';

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

module.exports = beget;
