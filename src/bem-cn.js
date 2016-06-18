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

	return selector(defaultSettings, {name});
};
 */
import {trim, assign} from './helpers';
import {ERROR_BLOCK_NAME_TYPE, ERROR_BLOCK_NAME_EMPTY} from './constants';

const IS_PREFIX = 'is-';
const HAS_PREFIX = 'has-';

let defaultSettings = {
		ns: '',
		el: '__',
		mod: '_',
		modValue: '_',
		classMap: null
	},
	// Settings object is global on module level
	settings = assign({}, defaultSettings);

/**
 * Returns given mixes as list of strings
 * @param {*[]} mixes
 * @return {String[]}
 * @example
block('block').mix(block('another')); "block another"
block('one').mix(['two', 'three']); "one two three"
 */
function normilizeMixes(mixes = []) {
	return mixes
		.map((mix) => {
			if (typeof mix === 'function') {
				return mix.toString();
			} else if (Array.isArray(mix)) {
				return mix.join(' ');
			} else if (typeof mix === 'string') {
				return mix;
			}

			return '';
		})
		.filter((mix) => mix);
}

/**
 * Returns final set of classes
 * @return {String}
 */
function toString(settings, context) {
	let {name, mods, mixes, states} = context,
		classes = [name];

	// Add list of modifiers
	if (mods) {
		classes = classes.concat(
			Object.keys(mods)
				.filter((key) => mods[key])
				.map((key) => {
					let value = mods[key];

					// Modifier with only name
					if (value === true) {
						return name + settings.mod + key;
					// Modifier with name and value
					} else {
						return name + settings.mod + key + settings.modValue + value;
					}
				})
		);
	}

	// Add mixes
	if (mixes) {
		classes = classes.concat(
			normilizeMixes(mixes)
		);
	}

	// Add states
	if (states) {
		Object.keys(states).forEach((prefix) => {
			let statesByPrefix = states[prefix];

			classes = classes.concat(
				Object.keys(statesByPrefix)
					.filter((key) => statesByPrefix[key])
					.map((key) => prefix + key)
			);
		});
	}

	// Add namespace
	if (settings.ns) {
		classes = classes.map((className) => settings.ns + className);
	}

	// Resolve class name from classMap
	if (settings.classMap) {
		classes = classes.map((className) => settings.classMap[className] || className);
	}

	return classes.join(' ');
}

/**
 * Adds new mixes to context and returns selector
 * @param {Object} settings
 * @param {Object} context
 * @param {*} mixes
 * @return {Function}
 */
function mix(settings, context, ...mixes) {
	// Copy context object for new selector generator
	let copied = assign({}, context);

	// Copy and update list of mixes
	copied.mixes = (copied.mixes || []).concat(mixes);

	return selector(settings, copied);
}

/**
 * Adds new states to context and returns selector
 * @param {Object} settings
 * @param {Object} context
 * @param {String} prefix One of available prefixes `is-` or `has-`
 * @param {Object} states
 * @return {Function}
 */
function state(settings, context, prefix, ...states) {
	// Copy context object for new selector generator
	let copied = assign({}, context),
		copiedState = assign({}, copied.states || {});

	// Copy and update object with states
	copiedState[prefix] = assign({}, copiedState[prefix] || {}, ...states);
	copied.states = copiedState;

	return selector(settings, copied);
}

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
 * @param {Object} [context.states] Store with all states
 * @param {Array} [context.mixes] List of external classes
 * @return {Function}
 */
function selector(settings, context) {
	function inner(...args) {
		// Call without arguments, time to return class names as a string
		if (!args.length) {
			return toString(settings, context);
		}

		// Don't forget to copy context object for new selector generator
		let copied = assign({}, context);

		// Add new elements and modifiers to the context
		copied = args.reduce((copied, arg) => {
			// New element found
			if (typeof arg === 'string') {
				copied.name += settings.el + arg;
			// New modifier found
			} else if (typeof arg === 'object') {
				copied.mods = assign(copied.mods || {}, arg);
			}

			return copied;
		}, copied);

		return selector(settings, copied);
	}

	inner.mix = mix.bind(null, settings, context);
	inner.has = state.bind(null, settings, context, HAS_PREFIX);
	inner.state = inner.is = state.bind(null, settings, context, IS_PREFIX);
	inner.toString = inner.valueOf = toString.bind(null, settings, context);
	inner.split = (...args) =>
		String.prototype.split.apply(
			toString(settings, context),
			args
		);

	return inner;
}

/**
 * Creates new BEM block
 * @param {String} name
 * @return {Function} Selector generator
 */
function block(name) {
	if (typeof name !== 'string') {
		throw new Error(ERROR_BLOCK_NAME_TYPE);
	}

	name = trim(name);

	if (!name) {
		throw new Error(ERROR_BLOCK_NAME_EMPTY);
	}

	// It is easy to define default settings here
	return selector(settings, {name});
}

/**
 * Updates settings object
 * @param  {Object} custom New custom settings
 */
block.setup = (custom = {}) => {
	assign(settings, custom);
};

/**
 * Sets default settings
 */
block.reset = () => {
	assign(settings, defaultSettings);
};

export default block;
