if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		const context = arguments[1];
		let i = 0;
		const l = this.length;
		while (i < l) {
			const item = this[i];
			if (predicate.call(context, item, i, this)) {
				return item;
			}
			i++;
		}
	};
}
