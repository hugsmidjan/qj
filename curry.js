// Super simple minimal currier
export default function curry(func, ...args) {
  return function (...args2) {
    return func.apply(this, args.concat(args2));
  };
}
