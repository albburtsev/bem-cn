/**
 * bem-cn — friendly BEM class names generator
 * @author Alexander Burtsev, http://burtsev.me, 2015
 * @license MIT
 */
(function (root, factory) {
	if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = factory();
	} else if ( typeof define === 'function' && define.amd ) {
		// AMD
		define([], factory);
	} else {
		// Browser globals
		root.Block = factory();
	}
})(this, function () {
	'use strict';

	/* jshint validthis: true */

	var ELEMENT_DELIMITER = '__',
		MODIFIER_DELIMITER = '_',
		WHITESPACE = ' ';

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
	 * Converts object with modifiers to array of strings
	 * Example: modObjectToArray({ color: 'red' }) -> ['', '_color_red']
	 */
	function modObjectToArray(obj) {
		return Object.keys(obj).reduce(function(array, key) {
			var value = obj[key];

			if ( !value ) {
				return array;
			}

			if ( value === true ) {
				array.push(MODIFIER_DELIMITER + key);
			} else {
				array.push(MODIFIER_DELIMITER + key + MODIFIER_DELIMITER + value);
			}

			return array;
		}, []);
	}

	/**
	 * Callable block instance
	 */
	function callableInstance() {
		var args = Array.prototype.slice.call(arguments),
			props = extend({}, this);

		props = args.reduce(function(props, argv) {
			if ( argv && typeof argv === 'string' ) {
				props.name = props.name + ELEMENT_DELIMITER + argv;
			}

			if ( argv && typeof argv === 'object' ) {
				props.mods.push(argv);
			}

			return props;
		}, props);

		return createBlock(props);
	}

	/**
	 * Static method toString() for callable instance
	 */
	function toString() {
		var name = this.name,
			classList = name;

		// Adds modifiers
		classList = this.mods.reduce(function(classList, modObject) {
			var modArray = modObjectToArray(modObject);

			if ( modArray.length ) {
				modArray.unshift('');
				classList += modArray.join(WHITESPACE + name);
			}

			return classList;
		}, classList);

		// Mix with another classes
		if ( this.mixes.length ) {
			classList += WHITESPACE + this.mixes.join(WHITESPACE);
		}

		return classList;
	}

	/**
	 * Static method mix() for callable instance
	 */
	function mix(className) {
		var props = extend({}, this);

		if ( className ) {
			props.mixes.push(className);
		}

		return createBlock(props);
	}

	/**
	 * Generator of block-functions
	 * @param {Object} props Properties of current block
	 * @return {Function}
	 */
	function createBlock(props) {
		props = extend({
			name: '',
			mods: [],
			mixes: []
		}, props || {});

		// Whilst JavaScript can't create callable objects with constructors
		var b = callableInstance.bind(props);
		b.toString = toString.bind(props);
		b.mix = mix.bind(props);

		return b;
	}

	/**
	 * Wrapper function
	 * @param {String} name Block name
	 * @return {Function}
	 */
	function Block(name) {
		return createBlock({ name: name });
	}

	return Block;
});
