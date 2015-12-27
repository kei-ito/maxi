/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('graph', [
			'nop',
			function (nop) {
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
					var draw = function (ngEvent, data, settings) {
						var canvas = setSize();
						var ctx = canvas.getContext('2d');
						var cw = canvas.width;
						var ch = canvas.height;
						var paddingTop = 30;
						var paddingRight = 30;
						var paddingBottom = 30;
						var paddingLeft = 30;
						var w = cw - paddingLeft - paddingRight;
						var h = ch - paddingBottom - paddingBottom;
						var zero = ch - paddingTop;
						var xMin = data.min[0];
						var xMax = data.max[0];
						var xDiff = w / (xMax - xMin);
						var yMin = data.min[1];
						var yMax = data.max[1];
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
						data.data.forEach(function (d) {
							var x = paddingLeft + (d[0] - xMin) * xDiff;
							bands.forEach(function (band) {
								var y = zero - (d[band.index] - yMin) * yDiff;
								var e = d[band.index + 1] * yDiff;
								ctx.strokeStyle = band.color;
								ctx.beginPath();
								ctx.moveTo(x, y + e);
								ctx.lineTo(x, y - e);
								ctx.moveTo(x - 1, y);
								ctx.lineTo(x + 1, y);
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
