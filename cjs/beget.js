'use strict';

// Prototypal inheritance
const F = function () {};
const hasOwnProperty = Object.prototype.hasOwnProperty;

function beget(proto, props) {
  F.prototype = proto;
  const o = new F();
  if ( props ) {
    for (let key in props) {
      if ( hasOwnProperty.call(props, key) ) {
        o[key] = props[key];
      }
    }
  }
  return o;
}

module.exports = beget;
