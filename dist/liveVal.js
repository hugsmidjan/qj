// liveVal
// update input/textarea values while maintaining cursor-position *from end*
function liveVal(input, value) {
    // NOTE: For non-text inputs (i.e. checkbox, radio, etc.)
    // `input.selectionStart` is null
    // and `input.setSelectionRange()` throws.
    var delta = value.length - input.value.length;
    var selStart = (input.selectionStart || 0) + delta;
    var selEnd = (input.selectionEnd || 0) + delta;
    input.value = value;
    if (input.setSelectionRange) {
        input.setSelectionRange(selStart, selEnd);
    }
}

module.exports = liveVal;
