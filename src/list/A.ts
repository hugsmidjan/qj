// List-to-Array converter
export default function A<T>(list: ArrayLike<T>): Array<T> {
  return [].slice.call(list);
}
