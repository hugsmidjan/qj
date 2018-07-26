'use strict';

// liveVal
// update input/textarea values while maintaining cursor-position *from end*
function liveVal(input, value) {
  const delta = value.length - input.value.length;
  const selStart = input.selectionStart + delta;
  const selEnd = input.selectionEnd + delta;
  input.value = value;
  if ( input.setSelectionRange ) {
    input.setSelectionRange(selStart, selEnd);
  }
}

module.exports = liveVal;
