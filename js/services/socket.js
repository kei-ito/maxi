/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('socket', [
			'$window', '$interval', 'ajax', '$q',
			function ($window, $interval, ajax, $q) {
				var deferred = $q.defer();
				var found = deferred.promise;
				var queue = [];
				var socket;
				var timer = $interval(function () {
					var listener;
					if ($window.___browserSync___) {
						socket = $window.___browserSync___.socket;
						if (!socket.id) {
							return;
						}
						$interval.cancel(timer);
						while (0 < queue.length) {
							listener = queue.pop();
							socket.on(listener.event, listener.callback);
						}
						deferred.resolve(socket);
					}
				}, 100);
				function bind() {
					found.then(function (socket) {
						ajax.post('/bind', {
							id: socket.id
						});
					});
				}
				function on(event, callback) {
					if (socket) {
						socket.on(event, callback);
					} else {
						queue.push({
							event: event,
							callback: callback
						});
					}
				}
				return {
					bind: bind,
					on: on
				};
			}
		]);
})(window);
