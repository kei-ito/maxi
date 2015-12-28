/* global window */
(function (window) {
	'use strict';
	var angular = window.angular;
	angular
		.module('a')
		.constant('digest', function ($scope) {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		})
		.constant('endpoint', (function (location, encodeURIComponent) {
			var index = ['maxi.wemo.me', 'kei-ito.github.io'].indexOf(location.hostname);
			if (index < 0) {
				index = 2;
			}
			return [
				'https://b8glyuhwhl.execute-api.ap-northeast-1.amazonaws.com/maxi_data',
				'https://qaixecha8g.execute-api.ap-northeast-1.amazonaws.com/maxi_data_github',
				'/api?url=' + encodeURIComponent('https://b8glyuhwhl.execute-api.ap-northeast-1.amazonaws.com/maxi_data')
			][index];
		})(window.location, window.encodeURIComponent))
		.constant('parseFloat', window.parseFloat)
		.constant('cache', {})
		.constant('equals', angular.equals)
		.constant('ngElement', angular.element)
		.constant('ngBody', angular.element(window.document.body))
		.constant('document', window.document)
		.constant('console', window.console)
		.constant('Math', window.Math)
		.constant('Date', window.Date)
		.constant('File', window.File)
		.constant('FormData', window.FormData)
		.constant('location', window.location)
		.constant('parseInt', window.parseInt)
		.constant('toArray', function (args) {
			return Array.prototype.slice.call(args);
		})
		.constant('token', {
			set: function (token) {
				window.localStorage.token = token || 'na';
			},
			get: function () {
				return window.localStorage.token || 'na';
			}
		})
		.constant('chomp', function (x) {
			return x.replace(/^\s*|\s*$/g, '');
		})
		.constant('nop', function (event) {
			if (event) {
				try {
					event.preventDefault();
					event.stopPropagation();
				} catch (error) {
				}
			}
			return false;
		})
		.constant('download', function (url, fileName) {
			var a = window.document.createElement('a');
			a.href = url;
			a.download = fileName;
			a.click();
		})
		.constant('debounce', function (fn, wait, thisArg) {
			var timer;
			return function () {
				var args = arguments;
				window.clearTimeout(timer);
				timer = window.setTimeout(function () {
					fn.apply(thisArg, args);
				}, wait);
			};
		});
})(window);
