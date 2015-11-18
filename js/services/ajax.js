/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('ajax', [
			'$http', 'token', '$q', '$state', 'File', 'FormData',
			function ($http, token, $q, $state, File, FormData) {
				function request(options, localOptions) {
					var deferred = $q.defer();
					var key;
					if (localOptions) {
						for (key in localOptions) {
							if (localOptions.hasOwnProperty(key)) {
								options[key] = localOptions[key];
							}
						}
					}
					options.headers = options.headers || {};
					options.headers['X-Token'] = token.get();
					$http(options).then(function (result) {
						deferred.resolve(result);
					}, function (result) {
						if (result.status === 401) {
							$state.go('home');
						}
						deferred.reject(result);
					});
					return deferred.promise;
				}
				function get(url, params, options) {
					return request({
						url: url,
						method: 'GET',
						params: params
					}, options);
				}
				function post(url, data, options) {
					return request({
						url: url,
						method: 'POST',
						data: data
					}, options);
				}
				function del(url, params, options) {
					return request({
						url: url,
						method: 'DELETE',
						params: params
					}, options);
				}
				function patch(url, data, options) {
					return request({
						url: url,
						method: 'PATCH',
						data: data
					}, options);
				}
				function put(url, data, options) {
					var option = {
						url: url,
						method: 'PUT'
					};
					var formData;
					if (data && data[0] instanceof File) {
						option.headers = {};
						option.headers['Content-Type'] = undefined;
						formData = new FormData();
						data.forEach(function (file) {
							formData.append(file.name, file);
						});
						option.data = formData;
					} else {
						option.data = data;
					}
					return request(option, options);
				}
				return {
					get: get,
					post: post,
					del: del,
					patch: patch,
					put: put
				};
			}
		]);
})(window);
