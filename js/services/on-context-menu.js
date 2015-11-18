/* global window */
(function (window) {
	'use strict';
	var angular = window.angular;
	angular
		.module('a')
		.factory('onContextMenu', [
			'$timeout', '$rootScope', 'nop',
			function ($timeout, $rootScope, nop) {
				var timers = [];
				function onContextMenu(element, callback) {
					element.attr('style', '-webkit-touch-callout: none');
					element.on('contextmenu', function (event) {
						callback(event);
						return nop(event);
					});
					element.on('touchstart', function (event) {
						timers.push($timeout(function () {
							callback(event, true);
						}, 1000));
					});
				}
				$rootScope.$on('touchend', function () {
					while (0 < timers.length) {
						$timeout.cancel(timers.pop());
					}
				});
				return onContextMenu;
			}
		]);
})(window);
