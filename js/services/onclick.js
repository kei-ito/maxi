/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('onClick', [
			'nop', 'ngElement', '$timeout', '$window',
			function (nop, ngElement, $timeout, $window) {
				var touchStartedId;
				var touchStartedX;
				var touchStartedY;
				var pointer;
				var getId = (function () {
					var counter = 0;
					return function () {
						return counter++;
					};
				})();
				function stopPropagation(event) {
					try {
						event.stopPropagation();
					} catch (err) {
					}
				}
				function addPointer(elem, x, y) {
					if (pointer) {
						pointer.remove();
					}
					pointer = ngElement('<div class="Pointer"></div>');
					pointer.css('left', x.toFixed(0) + 'px');
					pointer.css('top', y.toFixed(0) + 'px');
					elem.append(pointer);
					$timeout(function () {
						pointer.addClass('active');
					}, 0);
				}
				function fadePointer() {
					if (pointer) {
						pointer.addClass('fade');
					}
				}
				$window.addEventListener('mouseup', fadePointer);
				$window.addEventListener('touchend', fadePointer);
				return function (elem, options) {
					options = options || {};
					var id = getId();
					var nativeElement = elem[0];
					var onClick = options.onClick;
					var onTouchStart = options.onTouchStart;
					var onTouchEnd = options.onTouchEnd;
					var pointerDisabled = options.pointerDisabled || elem.hasClass('checkbox');
					var override = !elem.hasClass('clickable');
					function noop(event) {
						if (override) {
							return nop(event);
						}
					}
					function getTarget(event) {
						var target = event.target || event.srcElement;
						if (pointer && target === pointer[0]) {
							target = nativeElement;
						}
						return target;
					}
					function onDown(event) {
						if (elem.attr('disabled')) {
							return nop(event);
						} else if (options.strict && getTarget(event) !== elem[0]) {
							return;
						}
						var targetRect = nativeElement.getBoundingClientRect();
						var x = event.clientX;
						var y = event.clientY;
						touchStartedX = x;
						touchStartedY = y;
						touchStartedId = id;
						if (!pointerDisabled) {
							addPointer(elem, x - targetRect.left, y - targetRect.top);
						}
						if (onTouchStart) {
							onTouchStart();
						}
						stopPropagation(event);
					}

					function onUp(event) {
						if (elem.attr('disabled')) {
							return nop(event);
						} else if (options.strict && getTarget(event) !== elem[0]) {
							return;
						}
						var dx = touchStartedX - event.clientX;
						var dy = touchStartedY - event.clientY;
						var d = dx * dx + dy * dy;
						if (touchStartedId === id && d < 1000) {
							if (onTouchEnd) {
								onTouchEnd();
							}
							onClick(event, getTarget(event));
						}
						fadePointer();
						if (override) {
							return noop(event);
						}
					}

					elem.on('touchstart', function (event) {
						var touches = event.touches;
						if (touches.length === 1) {
							onDown(touches.item(0), true);
						} else {
							touchStartedId = null;
						}
						stopPropagation(event);
					});
					elem.on('touchend', function (event) {
						onUp(event.changedTouches.item(0), true);
						return noop(event);
					});
					elem.on('mousedown', onDown);
					elem.on('mouseup', onUp);
					elem.on('click', noop);
				};
			}
		]);
})(window);
