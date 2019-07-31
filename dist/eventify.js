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
// TODO: Finish adding eventname->callbackArguments map generic variable magic:
//
// type Callback<Args extends Array<any>> = (...args: Args) => void
//
// type EventArgMapper = Record<string, Array<any>>
//
// type Eventified<T extends object, Evs extends EventArgMapper = EventArgMapper> = T & {
//   on<Type extends keyof Evs>(eventName: Type, callback: Callback<Evs[Type]>): Eventified<T, Evs>
//   off<Type extends keyof Evs>(eventName: Type, callback: Callback<Evs[Type]>): Eventified<T, Evs>
//   emit<Type extends keyof Evs, E extends { type: Type }, Args extends Omit<Evs[Type], 0>>(event: keyof Evs | E, ...args: Args): Eventified<T, Evs>
// };
//
// type EventStore<Events extends EventArgMapper> = {
//   [name in keyof Events]?: Callback<Events[name]>
// }
//
// export default function eventify<Events extends EventArgMapper, T extends object>(object: T): Eventified<T, Events> {
//   const eventified = object as Eventified<T, Events>
//   let events = {} as EventStore<Events>;
function eventify(object) {
    var eventified = object;
    var events = {};
    eventified.on = function (eventName, callback) {
        if (callback) {
            var callbackList = events[eventName];
            if (!callbackList) {
                callbackList = events[eventName] = [];
            }
            if (callbackList && callbackList.indexOf(callback) === -1) {
                callbackList.push(callback);
            }
        }
        return this;
    };
    eventified.off = function (eventName, callback) {
        var numArgs = arguments.length;
        if (!numArgs) {
            events = {};
        }
        else if (numArgs === 1) {
            delete events[eventName];
        }
        else if (callback) {
            var callbackList = events[eventName] || [];
            var idx = callbackList.indexOf(callback);
            if (idx > -1) {
                callbackList.splice(idx, 1);
            }
        }
        return this;
    };
    eventified.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var firstArg = args[0];
        var evType;
        if (typeof firstArg === 'string') {
            evType = args.shift();
        }
        else if (firstArg) {
            evType = firstArg.type;
        }
        if (evType != null) {
            (events[evType] || [])
                .slice() // clone to prevent callbacks adding to the queue in mid-air
                .forEach(function (callback) {
                callback.apply(null, args);
            });
        }
        return this;
    };
    return eventified;
}

module.exports = eventify;
