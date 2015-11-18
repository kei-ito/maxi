/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('drag', [
			'ngElement', 'ngBody', 'nop', '$timeout',
			function (ngElement, ngBody, nop, $timeout) {
				var dragImageElement = ngElement('<div class="DragImage"></div>');
				ngBody.append(dragImageElement);
				function onDragStart(ngEvent, element, event) {
					dragImageElement.css('display', 'block');
					dragImageElement.empty();
					dragImageElement.append(element.innerText);
					event.dataTransfer.setDragImage(dragImageElement[0], 0, 0);
					return nop(ngEvent);
				}
				function onDragEnd(ngEvent) {
					dragImageElement.css('display', 'none');
					return nop(ngEvent);
				}
				function onDragOver(ngEvent, element, event) {
					element.classList.add('droppable');
					$timeout.cancel(element.timer);
					element.timer = $timeout(function () {
						element.classList.remove('droppable');
					}, 200);
					event.dataTransfer.dropEffect = 'move';
					nop(ngEvent);
					return nop(event);
				}
				return {
					onDragStart: onDragStart,
					onDragEnd: onDragEnd,
					onDragOver: onDragOver
				};
			}
		]);
})(window);
