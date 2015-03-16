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

	var ELEMENT_DELIMITER = '__',
		MODIFIER_DELIMITER = '_';

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
	 * Generator of block-functions
	 * @param {Object} props Properties of current block
	 * @return {Function}
	 */
	function createBlock(props) {
		var context = extend({
			name: '',
			mods: [],
			mixes: []
		}, props || {});

		var b = function() {
			var args = Array.prototype.slice.call(arguments),
				props = extend({}, this);

			if ( !args.length ) {
				return createBlock(props);
			}

			props = args.reduce(function(props, argv) {
				if ( typeof argv === 'string' ) {
					props.name = props.name + ELEMENT_DELIMITER + argv;
				}

				if ( typeof argv === 'object' ) {
					props.mods.push(argv);
				}

				return props;
			}, props);

			return createBlock(props);
		}.bind(context);

		b.toString = function() {
			var name = this.name,
				classList = name;

			// Adds modifiers
			classList = this.mods.reduce(function(classList, modObject) {
				var modArray = modObjectToArray(modObject);

				if ( modArray.length ) {
					modArray.unshift('');
					classList += modArray.join(' ' + name);
				}

				return classList;
			}, classList);

			// Mix with another classes
			if ( this.mixes.length ) {
				classList += ' ' + this.mixes.join(' ');
			}

			return classList;
		}.bind(context);

		b.mix = function(className) {
			var props = extend({}, this);

			if ( className ) {
				props.mixes.push(className);
			}

			return createBlock(props);
		}.bind(context);

		return b;
	}

	/**
	 * Wrapper function
	 * @param {String} name Block name
	 * @return {Object} 
	 */
	function Block(name) {
		return createBlock({ name: name });
	}

	return Block;
});
