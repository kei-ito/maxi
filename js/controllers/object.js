/* global window */
(function (window) {

	'use strict';

	window
		.angular
		.module('a')
		.controller('objectCtrl', [
			'ajax', '$state', 'endpoint', 'transformCSV', 'cache', 'transformList', '$scope', 'nop', 'copy',
			function (ajax, $state, endpoint, transformCSV, cache, transformList, $scope, nop, copy) {
				var viewModel = this;
				var name = viewModel.name = $state.params.name;
				var url = endpoint + '/' + name + '/' + name + '.txt';
				var find = function () {
					cache.list.forEach(function (object) {
						if (object.JNAME === name) {
							viewModel.info = object;
						}
					});
				};
				var draw = function () {
					var data = viewModel.data;
					if (!data) {
						return;
					}
					viewModel.drawing = true;
					$scope.$broadcast('data', data, {
						bands: viewModel.bands,
						bin: viewModel.bin
					});
				};
				viewModel.bin = 21;
				viewModel.decrementBin = function () {
					var bin = viewModel.bin;
					if (1 < bin) {
						viewModel.bin = bin - 1;
					}
					draw();
				};
				viewModel.incrementBin = function () {
					viewModel.bin += 1;
					draw();
				};
				viewModel.bandColors = {
					_2_20: 'rgba(255,0,0,1)',
					_2_4: 'rgba(0,153,0,1)',
					_4_10: 'rgba(0,0,255,1)',
					_10_20: 'rgba(255,0,255,1)'
				};
				viewModel.bands = copy(viewModel.bandColors);
				viewModel.toggleBand = function (bandName) {
					var bands = viewModel.bands;
					bands[bandName] = bands[bandName] ? null : viewModel.bandColors[bandName];
					draw();
				};
				$scope.$watch('object.bin', draw);
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
					draw();
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