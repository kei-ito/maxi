/* global window */
(function (window) {

	'use strict';

	window
		.angular
		.module('a')
		.controller('homeCtrl', [
			'ajax', 'transformList', 'endpoint', 'cache', '$timeout', 'localStorage', 'notify',
			function (ajax, transformList, endpoint, cache, $timeout, localStorage, notify) {
				var viewModel = this;
				viewModel.loading = true;
				viewModel.clearCache = function () {
					localStorage.clear();
					notify('Cache Cleared');
				};
				$timeout(function () {
					if (cache.list) {
						viewModel.list = cache.list;
						viewModel.loading = false;
					} else {
						viewModel.loading = true;
						ajax.get(endpoint, null, {
							transformResponse: transformList
						}).then(function (result) {
							viewModel.loading = false;
							viewModel.list = cache.list = result.data;
						});
					}
				}, 500);
			}
		]);

})(window);
