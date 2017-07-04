// Convert arry into an object keyed by prop.
// Prop values are assumed to be unique.
// Array items with repeated keys (prop value) are skipped
export default function byProp( arr, prop ) {
  const obj = {};
  arr.forEach((item) => {
    const key = item[prop];
    if ( !(key in obj) ) {
      obj[key] = item;
    }
  });
  return obj;
}
