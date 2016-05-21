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
import {trim} from './helpers';

export const ERROR_BLOCK_NAME_TYPE = 'Block name should be a string';
export const ERROR_BLOCK_NAME_EMPTY = 'Block name should be non-empty';

/**
 * Selector generator, self-curried function
 * @param {Object} settings
 * @param {String} [settings.ns = ''] Namespace for all classes
 * @param {String} [settings.el = '__'] Delimiter before element name
 * @param {String} [settings.mod = '_'] Delimiter before modifier name
 * @param {String} [settings.modValue = '_'] Delimiter before modifier value
 * @param {Object} [settings.classMap = null]
 * @param {Object} context
 * @param {String} context.name Block name
 * @return {Function}
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
		let {name} = context;
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
 * @todo: second parameter `settings`
 * @return {Function} Selector generator
 */
const block = (name) => {
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

	// It is easy to define default settings here
	return selector({
		ns: '',
		el: '__',
		mod: '_',
		modValue: '_',
		classMap: null
	}, {name});
};

export default block;
