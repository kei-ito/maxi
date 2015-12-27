/* global window */
(function (window) {

	'use strict';

	var document = window.document;
	var angular = window.angular;

	document.addEventListener('DOMContentLoaded', function () {
		angular.bootstrap(document.body, ['a'], {strictDi: true});
	});
	angular
		.module('a', [
			'ngAnimate',
			'ui.router'
		])
		.constant('localStorage', (function (localStorage, JSON, Date) {
			var EXPIRES = 43200000;
			return {
				setItem: function (key, value) {
					localStorage.setItem(key, JSON.stringify({
						data: value,
						created: new Date().getTime()
					}));
				},
				getItem: function (key) {
					var current = new Date().getTime();
					var value = localStorage[key];
					if (value) {
						value = JSON.parse(value);
						if (!value.created || value.created + EXPIRES < current) {
							value = undefined;
						}
					}
					return value;
				},
				removeItem: function (key) {
					localStorage.removeItem(key);
				},
				clear: function () {
					localStorage.clear();
				}
			};
		})(window.localStorage, window.JSON, window.Date))
		.constant('encodeURIComponent', window.encodeURIComponent)
		.constant('location', window.location)
		.constant('copy', angular.copy)
		.constant('Math', window.Math)
		.config([
			'$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider',
			function ($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
				var STATE_HOME = 'home';
				$locationProvider.html5Mode(false);
				$httpProvider.defaults.withCredentials = false;
				function getParentStateName(state) {
					var parentStateName = '';
					var stateName = state.name;
					if (stateName !== STATE_HOME) {
						parentStateName = stateName.replace(/\.[^\.]*?$/, '');
						if (parentStateName === stateName) {
							parentStateName = STATE_HOME;
						}
					}
					return parentStateName;
				}
				function header(state, parentState, params) {
					var html = '<div class="ViewHeader">';
					var title = params && params.name || state.title;
					if (parentState) {
						html += '<button id="back-button" class="BackButton" to-state="' + parentState.name + '" translate>' + parentState.title + '</button>';
					}
					html += '<h1 class="PageTitle" translate>' + title + '</h1></div>';
					return html;
				}
				function getter(stateName) {
					var before = '<div class="ViewContent"><div>';
					var after = '</div></div><div class="ViewCover"></div>';
					return [
						'$templateCache', '$state', '$stateParams', 'ngBody',
						function ($templateCache, $state, $stateParams, ngBody) {
							var CLASS_BACK = 'back';
							var state = $state.get(stateName);
							var parentStateName = getParentStateName(state);
							var parentState = parentStateName && $state.get(parentStateName);
							var template;
							if ($state.current.name === parentStateName) {
								ngBody.removeClass(CLASS_BACK);
							} else {
								ngBody.addClass(CLASS_BACK);
							}
							template = header(state, parentState, $stateParams);
							template += before;
							template += $templateCache.get(state.name);
							template += after;
							return template;
						}
					];
				}
				$stateProvider
					.state(STATE_HOME, {
						title: 'Object List',
						isRoot: true,
						url: '/home',
						templateProvider: getter(STATE_HOME),
						controller: 'homeCtrl',
						controllerAs: 'home'
					})
					.state('object', {
						title: 'Object',
						url: '/object/{name:string}',
						templateProvider: getter('object'),
						controller: 'objectCtrl',
						controllerAs: 'object'
					});
				$urlRouterProvider.otherwise('/home');
			}
		])
		.factory('transformList', function () {
			var REGEXP_TR = /<tr[^>]*?>([\s\S]*?)<\/tr>/g;
			var REGEXP_TD = /<(?:td|th)>(?:<\w+[^>]*?>)?(.*?)(?:<\/\w+[^>]*?>)?<\/(?:td|th)>/g;
			return function (html) {
				var headers;
				var dataSet = [];
				html.replace(REGEXP_TR, function (match, content) {
					var params = [];
					var data = {};
					content.replace(REGEXP_TD, function (match, param) {
						params.push(param);
					});
					if (!headers) {
						headers = params;
						data.isHeader = true;
					}
					headers.forEach(function (param, index) {
						data[param] = params[index];
					});
					dataSet.push(data);
				});
				return dataSet;
			};
		})
		.factory('transformCSV', [
			'parseFloat',
			function (parseFloat) {
				return function (csv) {
					var data = csv.split(/\r\n|\r|\n/);
					data.forEach(function (line, index, data) {
						line = line.split(',');
						line.forEach(function (x, i, line) {
							line[i] = parseFloat(x);
						});
						data[index] = line;
					});
					return data;
				};
			}
		])
		.run([
			'ngBody',
			function (ngBody) {
				ngBody.addClass('started');
			}
		]);

})(window);
