/* global window */
(function (window) {
	'use strict';
	var angular = window.angular;
	angular
		.module('a')
		.factory('confirm', [
			'pageCover', '$q', '$rootScope',
			function (pageCover, $q, $rootScope) {
				var deferred;
				return function (message, list, notDismissable) {
					var template = '<p>' + message + '</p><div class="btnRow">';
					list.forEach(function (item, index) {
						template += '<button on-click="choose(' + index + ')">' + item.toString() + '</button>';
					});
					template += '</div>';
					deferred = $q.defer();
					pageCover.dialog({
						template: template,
						scope: $rootScope,
						onDismiss: function () {
							deferred.resolve();
						},
						notDismissable: notDismissable
					});
					$rootScope.choose = function (index) {
						if (deferred) {
							deferred.resolve(list[index]);
							pageCover.dismiss();
						}
					};
					return deferred.promise;
				};
			}
		]);
})(window);
