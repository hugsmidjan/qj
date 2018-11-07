// shuffle the contents of an array
export default function shuffle(array, mutate) {
  array = mutate ? [].slice.call(array) : array;
  let left = array.length;
  while (left) {
    const p = Math.floor( left * Math.random(left--) );
    const t = array[left];
    array[left] = array[p];
    array[p] = t;
  }
  return array;
}
