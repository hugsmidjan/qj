'use strict';

// List-to-Array converter
function A/*::<T>*/(list/*:$Supertype<T[]> */)/*:T[] */ {
  return [].slice.call(list);
}

module.exports = A;
