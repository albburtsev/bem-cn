/**
 * Removes whitespaces from ends of a string
 * @param {String} string Source string
 * @return {String}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
 */
export const trim = (string) => {
	return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

/**
 * Copies all enumerable properties from given source objects to target
 * @param {Object} [target]
 * @param {Object} [source]
 * @return {Object}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
export const assign = (target = {}, ...args) => {
	for (let i = 0; i < args.length; i++) {
		let source = args[i];
		for (let key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}
	}

	return target;
};
