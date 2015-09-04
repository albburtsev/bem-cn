(function (root, factory) {
	/* istanbul ignore next */
	if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = factory();
	} else if ( typeof define === 'function' && define.amd ) {
		// AMD
		define([], factory);
	} else {
		// Browser globals
		root.block = factory();
	}
})(this, function () {
	'use strict';

	/* jshint validthis: true */

	var is = 'is-',
		space = ' ',
		separators = {
			el: '__',
			mod: '_'
		};

	/**
	 * Simplest mixin helper
	 */
	function extend(target, obj) {
		return Object.keys(obj).reduce(function(target, key) {
			var value = obj[key];

			// Shallow copy of array
			if ( Array.isArray(value) ) {
				value = value.slice();
			}

			target[key] = value;
			return target;
		}, target);
	}

	/**
	 * Shallow copy helper
	 */
	function copy(obj) {
		return extend({}, obj);
	}

	/**
	 * Converts object with classes to array of strings
	 * Example: objectToArray({ color: 'red' }) -> ['', '_color_red']
	 *
	 * @param {Object} obj { name: 'value' } or { name1: true, name2: false }
	 * @param {String} [separator='_'] Separator or prefix
	 */
	function objectToArray(obj, separator) {
		if ( separator === undefined ) {
			separator = separators.mod;
		}

		return Object.keys(obj).reduce(function(array, key) {
			var value = obj[key];

			if ( !value ) {
				return array;
			}

			if ( value === true ) {
				array.push(separator + key);
			} else {
				array.push(separator + key + separator + value);
			}

			return array;
		}, []);
	}

	/**
	 * Callable block instance
	 */
	function callableInstance() {
		var args = Array.prototype.slice.call(arguments),
			context = copy(this);

		context = args.reduce(function(context, argv) {
			if ( argv && typeof argv === 'string' ) {
				context.name = context.name + separators.el + argv;
			}

			if ( argv && typeof argv === 'object' ) {
				context.mods.push(argv);
			}

			return context;
		}, context);

		return factory(context);
	}

	/**
	 * Static method toString() for callable instance
	 */
	function toString() {
		var name = this.name,
			classList = name;

		// Add modifiers
		classList = this.mods.reduce(function(classList, modObject) {
			var modArray = objectToArray(modObject);

			if ( modArray.length ) {
				modArray.unshift('');
				classList += modArray.join(space + name);
			}

			return classList;
		}, classList);

		// Mix with another classes
		if ( this.mixes.length ) {
			classList += space + this.mixes.join(space);
		}

		// Add states
		var states = objectToArray(this.states, 'is-');
		if (states.length) {
			classList += space + states.join(' ');
		}

		return classList;
	}

	function split() {
		var classNames = toString.bind(this)();
		return String.prototype.split.apply(classNames, arguments);
	}

	/**
	 * Static method mix() for callable instance
	 * @param {String|Array|Object|block} className 'class'; ['one', 'two']; {one: true, two: false}; block('one')
	 */
	function mix(className) {
		var context = copy(this),
			classes;

		if ( className ) {
			if ( typeof className === 'string' || typeof className === 'function' ) {
				classes = [ className ];
			} else if ( Array.isArray(className) ) {
				classes = className;
			} else {
				classes = objectToArray(className, '');
			}
			context.mixes = context.mixes.concat(classes);
		}

		return factory(context);
	}

	/**
	 * Adds SMACSS-states: https://smacss.com/book/type-state
	 * @param {Object} obj State object
	 * @return {[type]} [description]
	 */
	function state(obj) {
		var context = copy(this),
			states = copy(context.states);

		extend(states, obj || {});
		context.states = states;

		return factory(context);
	}

	/**
	 * Generator of block-functions
	 * @param {Object} context Immutable context of current block
	 * @return {Function}
	 */
	function factory(context) {
		context = extend({
			name: '',
			mods: [],
			mixes: [],
			states: {}
		}, context || {});

		// Whilst JavaScript can't create callable objects with constructors
		var b = callableInstance.bind(context);
		b.toString = toString.bind(context);
		b.split = split.bind(context);
		b.mix = mix.bind(context);
		b.state = state.bind(context);

		return b;
	}

	/**
	 * Entry point
	 * @param {String} name Block name
	 * @return {Function}
	 */
	function block(name) {
		return factory({ name: name });
	}

	/**
	 * Setup separators
	 */
	block.setup = function(obj) {
		extend(separators, obj || {});
		return block;
	};

	return block;
});
