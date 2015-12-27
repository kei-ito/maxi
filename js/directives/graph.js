/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('graph', [
			'nop', 'Math',
			function (nop, Math) {
				function link(scope, element, attrs) {
					var canvas = element[0];
					var setSize = function () {
						var rect = canvas.getBoundingClientRect();
						canvas.width = rect.width;
						canvas.height = rect.height;
						return canvas;
					};
					var parseBands = function (bands) {
						var indexes = [];
						if (bands._2_20) {
							indexes.push({
								index: 1,
								color: bands._2_20
							});
						}
						if (bands._2_4) {
							indexes.push({
								index: 3,
								color: bands._2_4
							});
						}
						if (bands._4_10) {
							indexes.push({
								index: 5,
								color: bands._4_10
							});
						}
						if (bands._10_20) {
							indexes.push({
								index: 7,
								color: bands._10_20
							});
						}
						return indexes;
					};
					var binning = function (data, bin) {
						var binnedData = [];
						var min = [];
						var max = [];
						var currentBin;
						data.forEach(function (item, index) {
							var x = item[0];
							var id = Math.floor(x / bin);
							if (!currentBin || currentBin.id !== id) {
								if (currentBin) {
									currentBin[0] = (currentBin.min + currentBin.max) / 2;
									[1, 3, 5, 7].forEach(function (i) {
										var j = i + 1;
										var e = currentBin[j];
										currentBin[i] /= e;
										currentBin[j] = 1 / Math.sqrt(e);
									});
									currentBin.forEach(function (x, i) {
										if (typeof min[i] === 'undefined' || x < min[i]) {
											min[i] = x;
										}
										if (typeof max[i] === 'undefined' || max[i] < x) {
											max[i] = x;
										}
									});
									binnedData.push(currentBin);
								}
								currentBin = [0, 0, 0, 0, 0, 0, 0, 0, 0];
								currentBin.id = id;
								currentBin.min = item[0];
							}
							currentBin.max = item[0];
							[1, 3, 5, 7].forEach(function (i) {
								var j = i + 1;
								var e = item[j] * item[j];
								currentBin[i] += item[i] / e;
								currentBin[j] += 1 / e;
							});
						});
						binnedData.min = min;
						binnedData.max = max;
						return binnedData;
					};
					var draw = function (ngEvent, data, settings) {
						data = binning(data, settings.bin);
						var canvas = setSize();
						var ctx = canvas.getContext('2d');
						var cw = canvas.width;
						var ch = canvas.height;
						var paddingTop = 30;
						var paddingRight = 30;
						var paddingInnerRight = 10;
						var paddingBottom = 30;
						var paddingLeft = 30;
						var paddingInnerLeft = 10;
						var w = cw - paddingLeft - paddingRight;
						var h = ch - paddingBottom - paddingBottom;
						var zero = ch - paddingTop;
						var xMin = data.min[0];
						var xMax = data.max[0];
						var xDiff = (w - paddingInnerLeft - paddingInnerRight) / (xMax - xMin);
						var yMin = Math.min(data.min[1] - data.min[2], data.min[3] - data.min[4], data.min[5] - data.min[6], data.min[7] - data.min[8]);
						var yMax = Math.max(data.max[1] + data.max[2], data.max[3] + data.max[4], data.max[5] + data.max[6], data.max[7] + data.max[8]);
						var yDiff = h / (yMax - yMin);
						var bands = parseBands(settings.bands);
						ctx.fillStyle = '#000000';
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						ctx.moveTo(paddingLeft, paddingTop + h);
						ctx.lineTo(paddingLeft + w, paddingTop + h);
						ctx.lineTo(paddingLeft + w, paddingTop);
						ctx.lineTo(paddingLeft, paddingTop);
						ctx.closePath();
						ctx.stroke();
						data.forEach(function (d) {
							var x = paddingLeft + paddingInnerLeft + (d[0] - xMin) * xDiff;
							var minX = paddingLeft + paddingInnerLeft + (d.min - xMin) * xDiff;
							var maxX = paddingLeft + paddingInnerLeft + (d.max - xMin) * xDiff;
							bands.forEach(function (band) {
								var y = zero - (d[band.index] - yMin) * yDiff;
								var e = d[band.index + 1] * yDiff;
								ctx.strokeStyle = band.color;
								ctx.beginPath();
								ctx.moveTo(x, y + e);
								ctx.lineTo(x, y - e);
								ctx.moveTo(minX, y);
								ctx.lineTo(maxX, y);
								ctx.stroke();
							});
						});
						scope.$emit('drawn');
						return nop(ngEvent);
					};
					scope.$on('data', draw);
				}
				return {
					restrict: 'A',
					link: link
				};
			}
		]);
})(window);
