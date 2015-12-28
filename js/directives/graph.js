/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.directive('graph', [
			'nop', 'Math', 'mjd2date', 'date2mjd', 'Date',
			function (nop, Math, mjd2date, date2mjd, Date) {
				function link(scope, element, attrs) {
					var canvas = element[0];
					var setSize = function () {
						var rect = canvas.getBoundingClientRect();
						canvas.width = rect.width * 2;
						canvas.height = rect.height * 2;
						return canvas;
					};
					var parseBands = function (bands) {
						var indexes = [];
						if (bands._2_20) {
							indexes.push({
								index: 1,
								color: bands._2_20,
								title: '2-20keV'
							});
						}
						if (bands._2_4) {
							indexes.push({
								index: 3,
								color: bands._2_4,
								title: '2-4keV'
							});
						}
						if (bands._4_10) {
							indexes.push({
								index: 5,
								color: bands._4_10,
								title: '4-10keV'
							});
						}
						if (bands._10_20) {
							indexes.push({
								index: 7,
								color: bands._10_20,
								title: '10-20keV'
							});
						}
						return indexes;
					};
					var binning = function (data, bin) {
						var binnedData = [];
						var min = [];
						var max = [];
						var currentBin;
						data.forEach(function (item) {
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
					var getDateGrid = function (min, max, n) {
						var scale = (max - min) / n;
						var offset;
						var main = [];
						var sub = [];
						var y;
						var m;
						var d;
						var date;
						var initialize;
						var increment;
						var subIncrement;
						min = mjd2date(min);
						max = mjd2date(max);
						offset = -min.getTimezoneOffset();
						if (360 < scale) {
							initialize = function () {
								y = min.getUTCFullYear();
								m = 0;
								d = 1;
							};
							increment = function () {
								y += 1;
							};
							subIncrement = function () {
								m += 6;
							};
						} else if (180 < scale) {
							initialize = function () {
								y = min.getUTCFullYear();
								m = 0;
								d = 1;
							};
							increment = function () {
								m += 6;
							};
							subIncrement = function () {
								m += 1;
							};
						} else if (60 < scale) {
							initialize = function () {
								y = min.getUTCFullYear();
								m = min.getUTCMonth();
								d = 1;
							};
							increment = function () {
								m += 1;
							};
							subIncrement = function () {
								m += 0.5;
							};
						} else if (20 < scale) {
							initialize = function () {
								y = min.getUTCFullYear();
								m = min.getUTCMonth();
								d = min.getUTCDate();
							};
							increment = function () {
								d += 20;
							};
							subIncrement = function () {
								d += 5;
							};
						} else {
							initialize = function () {
								y = min.getUTCFullYear();
								m = min.getUTCMonth();
								d = min.getUTCDate();
							};
							increment = function () {
								d += 5;
							};
							subIncrement = function () {
								d += 1;
							};
						}
						initialize();
						date = new Date(y, m, d, 0, offset);
						while (date < min) {
							subIncrement();
							date = new Date(y, m, d, 0, offset);
						}
						while (date < max) {
							sub.push(date);
							subIncrement();
							date = new Date(y, m, d, 0, offset);
						}
						initialize();
						date = new Date(y, m, d, 0, offset);
						while (date < min) {
							increment();
							date = new Date(y, m, d, 0, offset);
						}
						while (date < max) {
							main.push(date);
							increment();
							date = new Date(y, m, d, 0, offset);
						}
						return {
							main: main,
							sub: sub
						};
					};
					var lastReceivedData;
					var lastReceivedSettings;
					var draw = function (ngEvent, data, settings) {
						lastReceivedData = data = data ? binning(data, settings.bin) : lastReceivedData;
						lastReceivedSettings = settings = settings || lastReceivedSettings;
						var bands = parseBands(settings.bands);
						var xMin = data.min[0];
						var xMax = data.max[0];
						var yMin;
						var yMax;
						bands.forEach(function (band) {
							var min = data.min[band.index];
							var max = data.max[band.index];
							if (!yMin || min < yMin) {
								yMin = min;
							}
							if (!yMax || yMax < max) {
								yMax = max;
							}
						});
						yMin = Math.min(0, yMin);
						var grid = {
							y: 0,
							yMin: 0,
							yMainMin: 0,
							yDigits: Math.round(Math.log(yMax) / Math.LN10 - 0.2) - 1
						};
						grid.yScale = Math.pow(10, grid.yDigits);
						grid.yDigits = Math.min(0, grid.yDigits);
						var paddingTop = 20;
						var innerPadding = 10;
						var paddingRight = 20;
						var paddingBottom = 70;
						var paddingLeft = 60 - 24 * grid.yDigits;
						var canvas = setSize();
						var ctx = canvas.getContext('2d');
						var cw = canvas.width;
						var ch = canvas.height;
						var w = cw - paddingLeft - paddingRight;
						var h = ch - paddingBottom - paddingTop;
						var xDiff = (w - 2 * innerPadding) / (xMax - xMin);
						var yDiff = (h - 2 * innerPadding) / (yMax - yMin);
						ctx.lineWidth = 1;
						ctx.fillStyle = '#000000';
						ctx.strokeStyle = '#000000';
						ctx.font = '400 22px sans-serif';
						ctx.textBaseline = 'middle';
						ctx.clearRect(0, 0, cw, ch);
						ctx.save();
						ctx.transform(1, 0, 0, -1, 0, ch);
						ctx.beginPath();
						ctx.moveTo(paddingLeft, paddingBottom + h);
						ctx.lineTo(paddingLeft + w, paddingBottom + h);
						ctx.lineTo(paddingLeft + w, paddingBottom);
						ctx.lineTo(paddingLeft, paddingBottom);
						ctx.closePath();
						ctx.stroke();
						while (yMin < grid.yMin) {
							grid.yMin -= grid.yScale;
						}
						grid.yMin += grid.yScale;
						while (yMin < grid.yMainMin) {
							grid.yMainMin -= grid.yScale * 5;
						}
						grid.yMainMin += grid.yScale * 5;
						ctx.strokeStyle = '#dddddd';
						ctx.textAlign = 'center';
						grid.x = getDateGrid(xMin, xMax, w / 300);
						grid.x.sub.forEach(function (d) {
							var x = paddingLeft + innerPadding + (date2mjd(d) - xMin) * xDiff;
							ctx.beginPath();
							ctx.moveTo(x, paddingBottom);
							ctx.lineTo(x, paddingBottom + h);
							ctx.stroke();
						});
						for (grid.y = grid.yMin; grid.y < yMax; grid.y += grid.yScale) {
							grid.yy = paddingBottom + innerPadding + (grid.y - yMin) * yDiff;
							ctx.beginPath();
							ctx.moveTo(paddingLeft, grid.yy);
							ctx.lineTo(paddingLeft + w, grid.yy);
							ctx.stroke();
						}
						ctx.strokeStyle = '#aaaaaa';
						grid.x.main.forEach(function (d) {
							var x = paddingLeft + innerPadding + (date2mjd(d) - xMin) * xDiff;
							ctx.beginPath();
							ctx.moveTo(x, paddingBottom);
							ctx.lineTo(x, paddingBottom + h);
							ctx.stroke();
							ctx.transform(1, 0, 0, -1, 0, ch);
							ctx.fillText(d.getFullYear(), x, paddingTop + h + 20);
							ctx.fillText((d.getMonth() + 1) + '.' + d.getDate(), x, paddingTop + h + 45);
							ctx.transform(1, 0, 0, -1, 0, ch);
						});
						ctx.textAlign = 'right';
						for (grid.y = grid.yMainMin; grid.y < yMax; grid.y += grid.yScale * 5) {
							grid.yy = paddingBottom + innerPadding + (grid.y - yMin) * yDiff;
							ctx.beginPath();
							ctx.moveTo(paddingLeft, grid.yy);
							ctx.lineTo(paddingLeft + w, grid.yy);
							ctx.stroke();
							ctx.transform(1, 0, 0, -1, 0, ch);
							ctx.fillText((Math.round(grid.y / grid.yScale) * grid.yScale).toFixed(-grid.yDigits), paddingLeft - 5, ch - grid.yy);
							ctx.transform(1, 0, 0, -1, 0, ch);
						}
						ctx.lineWidth = 2;
						data.forEach(function (d) {
							var x = paddingLeft + innerPadding + (d[0] - xMin) * xDiff;
							//var minX = paddingLeft + innerPadding + (d.min - xMin) * xDiff;
							//var maxX = paddingLeft + innerPadding + (d.max - xMin) * xDiff;
							bands.forEach(function (band, index) {
								var y = paddingBottom + innerPadding + (d[band.index] - yMin) * yDiff;
								var e = d[band.index + 1] * yDiff;
								var size = 5;
								ctx.strokeStyle = ctx.fillStyle = band.color;
								ctx.beginPath();
								ctx.moveTo(x, y + e);
								ctx.lineTo(x, y - e);
								//ctx.moveTo(minX, y);
								//ctx.lineTo(maxX, y);
								ctx.stroke();
								ctx.beginPath();
								switch (index) {
									case 0:
										ctx.arc(x, y, size, 0, Math.PI * 2);
										break;
									case 1:
										ctx.moveTo(x - size, y - size);
										ctx.lineTo(x - size, y + size);
										ctx.lineTo(x + size, y + size);
										ctx.lineTo(x + size, y - size);
										break;
									case 2:
										size *= Math.sqrt(2);
										ctx.moveTo(x, y + size);
										ctx.lineTo(x - size, y - size);
										ctx.lineTo(x + size, y - size);
										break;
									case 3:
										size *= Math.sqrt(2);
										ctx.moveTo(x - size, y);
										ctx.lineTo(x, y - size);
										ctx.lineTo(x + size, y);
										ctx.lineTo(x, y + size);
										break;
								}
								ctx.closePath();
								ctx.fill();
							});
						});
						ctx.restore();
						ctx.lineWidth = 3;
						ctx.textAlign = 'left';
						bands.forEach(function (band, index) {
							var size = 6;
							var plotSize;
							var split = w < 620;
							var x = paddingLeft + size * 5 + 140 * (split ? index % 2 : index);
							var y = paddingTop + h - size * (split && 1 < index ? 8 : 3);
							ctx.strokeStyle = ctx.fillStyle = band.color;
							ctx.beginPath();
							ctx.moveTo(x - size * 3, y);
							ctx.lineTo(x + size * 3, y);
							ctx.stroke();
							ctx.beginPath();
							switch (index) {
								case 0:
									plotSize = size;
									ctx.arc(x, y, plotSize, 0, Math.PI * 2);
									break;
								case 1:
									plotSize = size;
									ctx.moveTo(x - plotSize, y - plotSize);
									ctx.lineTo(x - plotSize, y + plotSize);
									ctx.lineTo(x + plotSize, y + plotSize);
									ctx.lineTo(x + plotSize, y - plotSize);
									break;
								case 2:
									plotSize = size * Math.sqrt(2);
									ctx.moveTo(x, y - plotSize);
									ctx.lineTo(x - plotSize, y + plotSize);
									ctx.lineTo(x + plotSize, y + plotSize);
									break;
								case 3:
									plotSize = size * Math.sqrt(2);
									ctx.moveTo(x - plotSize, y);
									ctx.lineTo(x, y - plotSize);
									ctx.lineTo(x + plotSize, y);
									ctx.lineTo(x, y + plotSize);
									break;
							}
							ctx.closePath();
							ctx.fill();
							ctx.fillText(band.title, x + size * 4, y);
						});
						ctx.fillStyle = '#000000';
						ctx.rotate(-0.5 * Math.PI);
						ctx.textAlign = 'center';
						ctx.fillText('counts cm  s', -0.5 * ch, 29);
						ctx.font = '400 16px sans-serif';
						ctx.fillText('-2  -1', -0.5 * ch + 60, 15);
						scope.$emit('drawn');
						return nop(ngEvent);
					};
					scope.$on('data', draw);
					scope.$on('resize', draw);
				}
				return {
					restrict: 'A',
					link: link
				};
			}
		]);
})(window);
