if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		const list = this;
		let i = 0;
		const l = list.length;
		while (i < l) {
			const item = list[i];
			if (predicate.call(arguments[1], item, i, list)) {
				return item;
			}
			i++;
		}
	};
}
