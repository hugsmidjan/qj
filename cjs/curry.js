'use strict';

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

module.exports = curry;
