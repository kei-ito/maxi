/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('include', [
			'$templateCache', '$compile', '$timeout',
			function ($templateCache, $compile, $timeout) {
				return {
					restrict: 'A',
					link: function (scope, element, attrs) {
						var src = attrs.include;
						if (!src) {
							return;
						}
						src = $templateCache.get(src);
						if (!src) {
							return;
						}
						$timeout(function () {
							var newElement = $compile(src)(scope);
							newElement.addClass(attrs['class']);
							element.replaceWith(newElement);
						});
					}
				};
			}
		]);
})(window);
