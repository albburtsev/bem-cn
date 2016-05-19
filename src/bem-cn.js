import {trim} from './helpers';

export const ERROR_BLOCK_NAME_TYPE = 'Block name should be a string';
export const ERROR_BLOCK_NAME_EMPTY = 'Block name should be non-empty';

/**
 * How it's working?
 * The essential part of this module is based on using currying pattern.
 * Just take a look at the interface:
 * 
 * @example
const selector = (settings, context) => {
	const inner = () => {
		return selector(...);
	};

	inner.toString = inner.valueOf = () => {
		// ...
	}

	// ...

	return inner;
};

const block = (settings) => {
	// ...

	return selector(settings);
};
 */
const selector = (settings, context) => {
	const inner = () => {
		return selector(settings, context);
	};

	inner.is = () => {
		// @todo
	};

	inner.has = () => {
		// @todo
	};

	inner.mix = () => {
		// @todo
	};

	inner.toString = inner.valueOf = () => {
		let {name} = settings;
		return name;
	};

	inner.split = () => {
		// @todo
	};

	inner.state = () => {
		// @todo
	};

	return inner;
};

/**
 * Creates new BEM block
 * @param {String} name
 * @param {Object} [settings]
 * @return {Function} Selector generator
 */
const block = (name, settings = {}) => {
	// @todo defaultSettings

	if (typeof name !== 'string') {
		throw new Error(ERROR_BLOCK_NAME_TYPE);
	}

	name = trim(name);

	if (!name) {
		throw new Error(ERROR_BLOCK_NAME_EMPTY);
	}

	block.setup = () => {
		// @todo
	};

	block.reset = () => {
		// @todo
	};

	// @todo: required polyfill or helper
	Object.assign(settings, {name});

	return selector(settings);
};

export default block;
