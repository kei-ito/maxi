/* global module, require */
(function (module, require) {

	'use strict';

	var fs = require('fs');
	var path = require('path');
	var async = require('async');

	function Node(name, children) {
		var that = this;
		that.name = name;
		that.children = children;
	}

	Node.prototype = {
		files: function (prefix) {
			var result = [];
			var that = this;
			prefix = prefix || '';
			if (that.children) {
				that.children.forEach(function (node) {
					node.files(prefix + that.name + '/').forEach(function (file) {
						result.push(file);
					});
				});
			} else {
				result.push(prefix + that.name);
			}
			return result;
		}
	};

	function ls(target, extList, callback) {
		async.waterfall([
			function (callback) {
				fs.readdir(target, callback);
			},
			function (files, callback) {
				var tasks = [];
				files.forEach(function (file) {
					var ext = path.extname(file);
					if (/^\./.test(file) || ext && extList && extList.indexOf(ext) < 0) {
						return;
					}
					tasks.push(function (callback) {
						var filepath = path.join(target, file);
						fs.stat(filepath, function (err, stats) {
							if (!err && stats.isDirectory()) {
								ls(filepath, extList, callback);
							} else {
								callback(err, new Node(file));
							}
						});
					});
				});
				async.parallel(tasks, callback);
			}
		], function (err, tree) {
			callback(err, new Node(path.basename(target), tree));
		});
	}

	module.exports = ls;

})(module, require);
