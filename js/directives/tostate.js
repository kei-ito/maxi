/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('toState', [
			'$compile', 'onClick', '$state', 'equals', '$timeout',
			function ($compile, onClick, $state, equals, $timeout) {
				var REGEX_PARAMS = /\(([^\(\)]*)\)/;
				var REGEX_EXTRACTPARAMS = /^[^\(\)]*\(([^\(\)]*)\)/;
				var clickableTags = ['a', 'button'];
				function isNotClickable(element) {
					return clickableTags.indexOf(element.prop('tagName').toLowerCase()) < 0;
				}
				return {
					restrict: 'A',
					link: function (scope, element, attrs) {
						function getState() {
							var stateExpression = attrs.toState;
							var params = {};
							if (REGEX_EXTRACTPARAMS.test(stateExpression)) {
								params = scope.$eval(stateExpression.replace(REGEX_EXTRACTPARAMS, '$1'));
							}
							return {
								name: stateExpression.replace(REGEX_PARAMS, ''),
								params: params
							};
						}
						function checkState() {
							var targetState = getState();
							if ($state.current.name === targetState.name && equals(targetState.params, $state.params)) {
								element.addClass(attrs.toStateActive);
							} else {
								element.removeClass(attrs.toStateActive);
							}
							(appendedLink || element).attr('href', $state.href(targetState.name, targetState.params));
						}
						var appendedLink;
						if (isNotClickable(element)) {
							appendedLink = $compile('<a>' + element.html() + '</a>')(scope);
							element.empty();
							element.append(appendedLink);
						}
						onClick(element, {
							onClick: function () {
								var targetState = getState();
								element.addClass('active');
								$state.go(targetState.name, targetState.params);
								$timeout(function () {
									element.removeClass('active');
								}, 500);
							},
							pointerDisabled: true
						});
						scope.$on('$stateChangeSuccess', checkState);
						checkState();
					}
				};
			}
		]);
})(window);
