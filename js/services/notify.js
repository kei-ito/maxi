/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('notify', [
			function () {
				var listeners = [];
				function notify(message) {
					listeners.forEach(function (listener) {
						listener.call(null, message);
					});
				}
				notify.listen = function (fn) {
					listeners.push(fn);
				};
				notify.hide = function () {
					listeners.forEach(function (listener) {
						listener.call();
					});
				};
				return notify;
			}
		]);
})(window);
