if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		const list = this;
		let i = 0;
		const l = list.length;
		while (i < l) {
			if (predicate.call(arguments[1], list[i], i, list)) {
				return i;
			}
			i++;
		}
		return -1;
	};
}
