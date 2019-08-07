// DECIDE: Add support for custom find function?
//   (where the default would be the identity function)
export default function uniqueArray<I, T extends Array<I>>(array: T): T {
  var result = [];
  var length = array.length;
  for (let i = 0; i < length; i++) {
    var value = array[i];
    if ( result.indexOf(value) < 0 ) {
      result.push(value);
    }
  }
  return result as T;
}