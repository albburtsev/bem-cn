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

	/**
	 * Simplest mixin helper
	 */
	function extend(target, obj) {
		return Object.keys(obj).reduce(function(target, key) {
			target[key] = obj[key];
			return target;
		}, target);
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
			var args = Array.prototype.slice.call(arguments);

			if ( !args.length ) {
				return createBlock(this);
			}

			// Update context here
			return createBlock(this);
		}.bind(context);

		b.toString = function() {
			// @todo: calculate class name here
			return this.name;
		}.bind(context);

		b.mix = function(mixed) {
			this.mixes.push(mixed);
			return createBlock(this);
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
