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
export default function curry(func, ...args) {
  return function (...args2) {
    return func.apply(this, args.concat(args2));
  };
}
