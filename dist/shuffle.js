// shuffle the contents of an array
function shuffle(array, mutate) {
    array = mutate ? [].slice.call(array) : array;
    var left = array.length;
    while (left) {
        var p = Math.floor(left * Math.random());
        left -= 1;
        var t = array[left];
        array[left] = array[p];
        array[p] = t;
    }
    return array;
}

module.exports = shuffle;
