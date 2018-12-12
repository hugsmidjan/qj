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
export default function eventify(object) {

  let events = {};

  object.on = function (eventName, callback) {
    if ( callback ) {
      let callbackList = events[eventName];
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
    const numArgs = arguments.length;
    if ( !numArgs ) {
      events = {};
    }
    else if ( numArgs === 1 ) {
      delete events[eventName];
    }
    else if ( callback ) {
      const callbackList = events[eventName] || [];
      const idx = callbackList.indexOf( callback );
      if ( idx > -1 ) {
        callbackList.splice( idx, 1 );
      }
    }
    return this;
  };


  object.emit = function (...args) {
    const firstArg = args[0];
    let evType;
    if ( typeof firstArg === 'string' ) {
      evType = args.shift();
    }
    else if ( firstArg ) {
      evType = firstArg.type;
    }
    if ( evType != null ) {
      (events[evType] || [])
          .slice() // clone to prevent callbacks adding to the queue in mid-air
          .forEach((callback) => {
            callback.apply(null, args);
          });
    }
    return this;
  };

  return object;

}