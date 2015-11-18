/* global window */
(function (window) {
	'use strict';
	var angular = window.angular;
	angular
		.module('a')
		.factory('email', [
			'notify', '$timeout', 'ajax', 'pageCover',
			function (notify, $timeout, ajax, pageCover) {
				var timer;
				function fillOut() {
					pageCover.dialog({
						template: '<p>まだつくってません</p>'
					});
				}
				function email(options) {
					$timeout.cancel(timer);
					timer = $timeout(function () {
						notify('メールを送信中です');
						ajax.post('/mail', options).then(function () {
							notify('メールを送信しました');
						}).then(function (result) {
							console.log(result);
						}, function (result) {
							if (result.status === 406) {
								fillOut(result.data);
							}
						});
					}, 200);
				}
				return email;
			}
		]);
})(window);
