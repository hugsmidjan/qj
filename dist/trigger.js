function trigger(type, elm) {
  var e = new Event(type);
  elm.dispatchEvent( e );
}

module.exports = trigger;
