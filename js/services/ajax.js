/* global window */
(function (window) {

	'use strict';

	window
		.angular
		.module('a')
		.factory('ajax', [
			'$http', 'endpoint', 'token', '$q', '$state', 'File', 'FormData', 'localStorage',
			function ($http, endpoint, token, $q, $state, File, FormData, localStorage) {
				function request(options, localOptions, useCache) {
					var deferred = $q.defer();
					var key;
					var cache;
					if (localOptions) {
						for (key in localOptions) {
							if (localOptions.hasOwnProperty(key)) {
								options[key] = localOptions[key];
							}
						}
					}
					options.headers = options.headers || {};
					options.headers['X-Token'] = token.get();
					key = options.url;
					options.url = endpoint + options.url;
					cache = useCache && localStorage.getItem(key);
					if (cache) {
						deferred.resolve(cache);
					} else {
						$http(options).then(function (result) {
							localStorage.setItem(key, result.data);
							deferred.resolve(result);
						}, function (result) {
							if (result.status === 401) {
								$state.go('home');
							}
							deferred.reject(result);
						});
					}
					return deferred.promise;
				}
				function get(url, params, options, useCache) {
					return request({
						url: url,
						method: 'GET',
						params: params
					}, options, useCache);
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
