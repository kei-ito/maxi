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
					var draw = function (ngEvent, data) {
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
						ctx.fillStyle = '#000000';
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						ctx.moveTo(paddingLeft, paddingTop + h);
						ctx.lineTo(paddingLeft + w, paddingTop + h);
						ctx.lineTo(paddingLeft + w, paddingTop);
						ctx.lineTo(paddingLeft, paddingTop);
						ctx.closePath();
						ctx.stroke();
						ctx.strokeStyle = 'rgba(0,0,0,0.3)';
						data.forEach(function (d, index) {
							var x = paddingLeft + (d[0] - xMin) * xDiff;
							var y = zero - (d[1] - yMin) * yDiff;
							var e = d[2] * yDiff;
							ctx.beginPath();
							ctx.moveTo(x, y + e);
							ctx.lineTo(x, y - e);
							ctx.moveTo(x - 1, y);
							ctx.lineTo(x + 1, y);
							ctx.stroke();
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
