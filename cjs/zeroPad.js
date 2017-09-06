'use strict';

// coderjoe zero padding for numbers - http://jsperf.com/left-zero-pad/18
function zeroPad(number, width) {
  var num = Math.abs(number);
  var zeros = Math.max(0, width - Math.floor(num).toString().length );
  zeros = Math.pow(10,zeros).toString().substr(1);
  return (number<0 ? '-' : '') + zeros + num;
}

module.exports = zeroPad;
