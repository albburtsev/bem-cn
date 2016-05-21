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

const block = (name) => {
	// ...

	return selector(settings, {name});
};
 */
import {trim, assign} from './helpers';

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
 * @param {String} context.name Block or element name
 * @param {Object} [context.mods] Store with all modifiers
 * @return {Function}
 */
const selector = (settings, context) => {
	const inner = (...args) => {
		let updated = args.reduce((updated, arg) => {
			// New element found
			if (typeof arg === 'string') {
				updated.name += settings.el + arg;
			// New modifier found
			} else if (typeof arg === 'object') {
				updated.mods = assign(updated.mods || {}, arg);
			}

			return updated;
		}, assign({}, context));

		return selector(settings, updated);
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
		let {name, mods} = context,
			classes = [name];

		// Add list of modifiers
		if (mods) {
			classes = classes.concat(
				Object.keys(mods)
					.map((key) => {
						let value = mods[key];

						// Modifier with only name
						if (value === true) {
							return name + settings.mod + key;
						// Modifier with name and value
						} else if (value) {
							return name + settings.mod + key + settings.modValue + value;
						}
					})
					.filter((_class) => _class)
			);
		}

		return classes.join(' ');
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
