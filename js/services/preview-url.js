/* global window */
(function (window) {
	'use strict';
	var angular = window.angular;
	angular
		.module('a')
		.factory('previewUrl', [
			'location', '$sce',
			function (location, $sce) {
				function previewUrl(url) {
					if (url) {
						url = location.protocol + '//' + location.hostname + url;
						url = $sce.trustAsResourceUrl(url);
					} else {
						url = null;
					}
					return url;
				}
				return previewUrl;
			}
		]);
})(window);
