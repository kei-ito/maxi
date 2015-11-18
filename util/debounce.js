/* global module, setTimeout, clearTimeout */
(function (module, setTimeout, clearTimeout) {

	'use strict';

	function debounce(fn, wait, thisArg) {
		var timer;
		return function () {
			var args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(thisArg, args);
			}, wait);
		};
	}

	module.exports = debounce;

})(module, setTimeout, clearTimeout);
