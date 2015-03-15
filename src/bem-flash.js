(function (root, factory) {
	'use strict';

	if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = factory();

	} else if ( typeof define === 'function' && define.amd ) {
		// AMD
		define([], factory);

	} else {
		// Browser globals
		root.BemFlash = factory();
	}
})(this, function () {
	// TODO	
});
