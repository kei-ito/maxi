/* global require, process, console */
(function (require, process, console) {
	var async = require('async');
	var glob = require('glob');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: 'ap-northeast-1'
	});
	async.waterfall([
		function (callback) {
			var patterns = [
				'*.html',
				'js/**/*.js',
				'css/**/*.css',
				'img/**/*.svg'
			];
			patterns.forEach(function (pattern, index, patterns) {
				patterns[index] = function (callback) {
					glob(pattern, callback);
				};
			});
			async.parallel(patterns, callback);
		},
		function (results, callback) {
			var files = [];
			files.concat.apply(files, results).forEach(function (file) {
				files.push(function (callback) {
					async.waterfall([
						function (callback) {
							fs.readFile(file, callback);
						},
						function (body, callback) {
							s3.putObject({
								Bucket: 'maxi.wemo.me',
								Key: file,
								Body: body,
								ACL: 'public-read'
							}, callback);
						}
					], callback);
				});
			});
			async.parallel(files, callback);
		}
	], function (err) {
		if (err) {
			console.log(err);
		}
	});
})(require, process, console);
