/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('checker', [
			function () {
				return {
					restrict: 'A',
					link: function (scope, element, attrs) {
						scope.$watch(attrs.checker, function (value) {
							if (value) {
								element.addClass('checked');
							} else {
								element.removeClass('checked');
							}
						});
					}
				};
			}
		]);
})(window);
