if (!Object.entries) {
	Object.entries = function(object) {
		return Object.keys(object).map(function(key) {
			return [key, object[key]];
		});
	};
}
