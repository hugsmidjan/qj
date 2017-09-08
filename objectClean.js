// Returns a clone of original object with keys with undefined values deleted
// Returns the original if nothing changed.
const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function objectClean(original) {
  let deleted;
  const clone = {};
  for (const key in original) {
    if ( hasOwnProperty.call(original, key) ) {
      if ( original[key] !== undefined ) {
        clone[key] = original[key];
      }
      else {
        deleted = true;
      }
    }
  }
  return deleted ? clone : original;
}
