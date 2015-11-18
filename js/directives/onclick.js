/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('onClick', [
			'onClick',
			function (onClick) {
				return {
					restrict: 'A',
					link: function (scope, element, attrs) {
						onClick(element, {
							onClick: function () {
								var expression = attrs.onClick;
								if (expression) {
									scope.$applyAsync(expression);
								}
							}
						});
					}
				};
			}
		]);
})(window);
