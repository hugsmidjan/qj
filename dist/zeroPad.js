// coderjoe zero padding for numbers - http://jsperf.com/left-zero-pad/18
function zeroPad(number, width) {
    var absNum = Math.abs(number);
    var numZeros = Math.max(0, width - Math.floor(absNum).toString().length);
    var zeros = Math.pow(10, numZeros).toString().substr(1);
    return (number < 0 ? '-' : '') + zeros + absNum;
}

module.exports = zeroPad;
