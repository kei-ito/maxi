/* global window */
(function (window) {
	'use strict';
	var angular = window.angular;
	angular
		.module('a')
		.factory('select', [
			'pageCover', '$q', '$rootScope',
			function (pageCover, $q, $rootScope) {
				var deferred;
				return function (list, notDismissable) {
					var template = '<ul>';
					list.forEach(function (item, index) {
						template += '<li><button on-click="choose(' + index + ')">' + item.toString() + '</button></li>';
					});
					template += '</ul>';
					deferred = $q.defer();
					pageCover.toast({
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
