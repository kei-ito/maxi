/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('pageCover', [
			'document', 'ngElement', '$rootScope', '$timeout', '$templateCache', '$compile', 'onClick',
			function (document, ngElement, $rootScope, $timeout, $templateCache, $compile, onClick) {
				var CLASS_DISMISSABLE = 'dismissable';
				var CANCEL_BUTTON = '<button on-click="dismiss()" translate>キャンセル</button>';
				var CLASS_TOAST = 'toast';
				var CLASS_DIALOG = 'dialog';
				var KEYCODE_ESC = 27;
				var cover = ngElement(document.getElementById('page-cover'));
				var dismissable;
				var content;
				var onDismiss;
				var scheduledDismiss;
				function dismiss() {
					$timeout.cancel(scheduledDismiss);
					scheduledDismiss = $timeout(function () {
						if (onDismiss) {
							onDismiss();
						}
						$rootScope.$applyAsync('coverOn=0');
						content = null;
						scheduledDismiss = null;
					}, 100);
				}
				function compile(html, data) {
					return html.replace(/<%=(.*?)%>/g, function (match, key) {
						return data[key];
					});
				}
				function getTemplate(options) {
					var template;
					if (options.templateName) {
						template = $templateCache.get(options.type + '/' + options.templateName);
					} else {
						template = options.template || '';
					}
					if (options.type === CLASS_TOAST) {
						template += CANCEL_BUTTON;
					}
					if (options.data) {
						template = compile(template, options.data);
					}
					return '<div class="PageCoverContent">' + template + '</div>';
				}
				function setDismissability(bool) {
					dismissable = bool;
					if (bool) {
						cover.addClass(CLASS_DISMISSABLE);
					} else {
						cover.removeClass(CLASS_DISMISSABLE);
					}
				}
				function pageCover(options) {
					var isActive = !!content;
					var template;
					options = options || {};
					template = getTemplate(options);
					onDismiss = options.onDismiss;
					content = $compile(template)(options.scope || $rootScope);
					if (scheduledDismiss || isActive) {
						$timeout.cancel(scheduledDismiss);
						cover.addClass('fade');
						$timeout(function () {
							cover.empty();
							cover.append(content);
							cover.removeClass(CLASS_TOAST + ' ' + CLASS_DIALOG);
							cover.addClass(options.type);
							$timeout(function () {
								cover.removeClass('fade');
							}, 200);
						}, 200);
					} else {
						cover.empty();
						cover.append(content);
						cover.removeClass(CLASS_TOAST + ' ' + CLASS_DIALOG);
						cover.addClass(options.type);
					}
					setDismissability(false);
					$timeout(function () {
						setDismissability(!options.notDismissable);
					}, 300);
					$rootScope.$applyAsync('coverOn=1');
				}
				onClick(cover, {
					strict: true,
					onClick: function (event) {
						if (dismissable) {
							dismiss();
						}
					}
				});
				$rootScope.$on('keyup', function (ngEvent, keyBoardEvent) {
					if (keyBoardEvent.keyCode === KEYCODE_ESC && dismissable) {
						dismiss();
					}
				});
				$rootScope.dismiss = dismiss;
				function preset(className) {
					return function (options) {
						options = options || {};
						options.type = className;
						pageCover(options);
					};
				}
				pageCover.toast = preset(CLASS_TOAST);
				pageCover.dialog = preset(CLASS_DIALOG);
				pageCover.dismiss = dismiss;
				return pageCover;
			}
		]);
})(window);
