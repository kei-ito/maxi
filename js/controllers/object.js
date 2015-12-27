/* global window */
(function (window) {

	'use strict';

	window
		.angular
		.module('a')
		.controller('objectCtrl', [
			'ajax', '$state', 'endpoint', 'transformCSV', 'cache', 'transformList', '$scope', 'nop','copy',
			function (ajax, $state, endpoint, transformCSV, cache, transformList, $scope, nop, copy) {
				var viewModel = this;
				var name = viewModel.name = $state.params.name;
				var url = endpoint + '/' + name + '/' + name + '_orb.txt';
//				var url = endpoint + '/' + name + '/' + name + '_weekbin.txt';
//				var url = endpoint + '/' + name + '/' + name + '.txt';
				var find = function () {
					cache.list.forEach(function (object) {
						if (object.JNAME === name) {
							viewModel.info = object;
						}
					});
				};
				viewModel.bandColors = {
					_2_20: 'rgba(255,0,0,0.1)',
					_2_4: 'rgba(0,255,0,0.1)',
					_4_10: 'rgba(0,0,255,0.1)',
					_10_20: 'rgba(255,0,255,0.1)'
				};
				viewModel.bands = copy(viewModel.bandColors);
				viewModel.toggleBand = function (bandName) {
					var bands = viewModel.bands;
					bands[bandName] = bands[bandName] ? null : viewModel.bandColors[bandName];
				};
				viewModel.draw = function () {
					viewModel.drawing = true;
					$scope.$broadcast('data', viewModel.data, {
						bands: viewModel.bands
					});
				};
				$scope.$on('drawn', function (ngEvent) {
					viewModel.drawing = false;
					return nop(ngEvent);
				});
				viewModel.loading = true;
				ajax.get(url, null, {
					transformResponse: transformCSV
				}).then(function (result) {
					viewModel.loading = false;
					viewModel.data = result.data;
					viewModel.draw();
				});
				if (cache.list) {
					find();
				} else {
					ajax.get(endpoint, null, {
						transformResponse: transformList
					}).then(function (result) {
						cache.list = result.data;
						find();
					});
				}
			}
		]);

})(window);
