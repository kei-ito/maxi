/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('notifier', [
			'notify', '$timeout',
			function (notify, $timeout) {
				return {
					restrict: 'A',
					scope: true,
					link: function (scope, element, attrs) {
						var timer;
						notify.listen(function (message) {
							$timeout.cancel(timer);
							scope.message = '';
							if (message) {
								$timeout(function () {
									scope.message = message;
									scope.messageBody = message;
								}, 50);
								timer = $timeout(function () {
									scope.message = '';
								}, 3000);
							}
						});
					}
				};
			}
		]);
})(window);
