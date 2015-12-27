/* global module, require, console */
(function (module, require, console) {

	'use strict';

	var https = require('https');
	var URL = require('url');

	module.exports = function (req, res) {
		var url = URL.parse(req.params.url);
		var req2 = https.request({
			hostname: url.hostname,
			path: url.path,
			port: url.port || 443,
			method: req.method,
			rejectUnauthorized: false,
			sendDate: true
		});
		var onError = function (error) {
			console.log(error.message);
			console.log(error.stack);
			res.statusCode = 500;
			res.end();
		};
		console.log('>' + url.href);
		req
			.on('error', onError)
			.on('data', function (chunk) {
				req2.write(chunk);
			})
			.on('end', function () {
				req2.end();
			});
		req2
			.on('error', onError)
			.on('response', function (res2) {
				console.log('<' + url.href + ' ' + res2.statusCode);
				res2.on('data', function (chunk) {
					res.write(chunk);
				});
				res2.on('end', function () {
					res.end();
				});
			});
	};

})(module, require, console);
