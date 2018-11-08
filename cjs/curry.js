// const _curriers = [
//     null,
//     (func, args) => {
//         return function (a) {
//             return func.apply(this, args.concat([a]));
//         };
//     },
//     (func, args) => {
//         return function (a,b) {
//             return func.apply(this, args.concat([a,b]));
//         };
//     },
// ];
// const _currierN = (func, args) => {
//     return function (...args2) {
//         return func.apply(this, args.concat(args2));
//     };
// };
//
// export default function curry(func, ...args) {
//     const currier = _curriers[func.length - args.length] || _currierN;
//     return currier(func, args);
// }

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
