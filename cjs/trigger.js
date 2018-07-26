'use strict';

function trigger(type, elm) {
  const e = new Event(type);
  elm.dispatchEvent( e );
}

module.exports = trigger;
