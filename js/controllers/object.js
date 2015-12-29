/* global window */
(function (window) {

	'use strict';

	window
		.angular
		.module('a')
		.controller('objectCtrl', [
			'ajax', '$state', 'transformCSV', 'cache', 'transformList', '$scope', 'nop', 'copy',
			function (ajax, $state, transformCSV, cache, transformList, $scope, nop, copy) {
				var viewModel = this;
				var name = viewModel.name = $state.params.name;
				var url = '/' + name + '/' + name + '.txt';
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
					_2_20: 'rgb(96,96,96)',
					_2_4: 'rgb(255,40,0)',
					_4_10: 'rgb(0,65,255)',
					_10_20: 'rgb(154,0,121)'
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
					ajax.get('/', null, {
						transformResponse: transformList
					}, true).then(function (result) {
						cache.list = result.data;
						find();
					});
				}
			}
		]);

})(window);
