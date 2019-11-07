Object.assign =
	Object.assign ||
	function(target) {
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}
		const output = Object(target);
		const hasOwn = Object.prototype.hasOwnProperty;
		for (let index = 1; index < arguments.length; index++) {
			const source = arguments[index];
			if (source !== undefined && source !== null) {
				for (const nextKey in source) {
					if (hasOwn.call(source, nextKey)) {
						output[nextKey] = source[nextKey];
					}
				}
			}
		}
		return output;
	};
