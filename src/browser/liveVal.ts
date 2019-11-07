// liveVal
// update input/textarea values while maintaining cursor-position *from end*
export default function liveVal(
	input: HTMLInputElement | HTMLTextAreaElement,
	value: string
): void {
	// NOTE: For non-text inputs (i.e. checkbox, radio, etc.)
	// `input.selectionStart` is null
	// and `input.setSelectionRange()` throws.
	const delta = value.length - input.value.length;
	const selStart = (input.selectionStart || 0) + delta;
	const selEnd = (input.selectionEnd || 0) + delta;
	input.value = value;
	if (input.setSelectionRange) {
		input.setSelectionRange(selStart, selEnd);
	}
}
