'use strict';

// liveVal
// update input/textarea values while maintaining cursor-position *from end*
function liveVal(input, value) {
  var delta = value.length - input.value.length;
  var selStart = input.selectionStart + delta;
  var selEnd = input.selectionEnd + delta;
  input.value = value;
  if ( input.setSelectionRange ) {
    input.setSelectionRange(selStart, selEnd);
  }
}

module.exports = liveVal;
