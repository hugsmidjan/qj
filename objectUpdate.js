// Returns a clone of original object with newValues assigned
// Returns the original if nothing changed.
const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function objectUpdate(original, newValues) {
  let clone;
  for (const key in newValues) {
    if ( hasOwnProperty.call(newValues, key) &&  original[key] !== newValues[key] ) {
      // IE11 compatible no-polyfill version
      if ( !clone ) {
        clone = {};
        for (const originalKey in original) {
          if ( hasOwnProperty.call(original, originalKey) ) {
            clone[originalKey] = original[originalKey];
          }
        }
      }
      clone[key] = newValues[key];
      // // Modern version:
      // clone = { ...original, ...newValues };
      // break;
    }
  }
  return clone || original;
}
