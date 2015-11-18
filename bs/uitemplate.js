/* global module, require, process, console */
(function (module, require, process, console) {

	'use strict';

	var WAIT = 200;
	var BEFORE = [
		'/* global window */',
		'(function (window) {',
		'\t\'use strict\';',
		'\twindow',
		'\t\t.angular',
		'\t\t.module(\'a\')',
		'\t\t.run([',
		'\t\t\t\'$templateCache\',',
		'\t\t\tfunction($templateCache) {',
		''
	].join('\n');
	var AFTER = [
		'',
		'\t\t\t}',
		'\t\t]);',
		'})(window);'
	].join('\n');
	var async = require('async');
	var fs = require('fs');
	var path = require('path');
	var minify = require('html-minifier').minify;
	var minifyOptions = {
		removeComments: true,
		collapseWhitespace: true,
		collapseBooleanAttributes: true
	};
	var cwd = process.cwd();
	var ls = require('../util/ls');
	var debounce = require('../util/debounce');

	function compressAndEscape(html) {
		html = minify(html, minifyOptions);
		html = html.replace(/\t/g, '\\t');
		html = html.replace(/\n/g, '\\n');
		html = html.replace(/\r/g, '\\r');
		html = html.replace(/\'/g, '\\\'');
		return html;
	}

	function getTemplateScript(file) {
		var script = '\t\t\t\t$templateCache.put(\'';
		script += file.path.replace(/^.*?templates\/(.*?)\.html$/, '$1');
		script += '\', \'';
		script += compressAndEscape(file.data.toString());
		script += '\');';
		return script;
	}

	function compile() {
		console.log('ngtemplate: start compile');
		async.waterfall([
			function (callback) {
				ls(path.join(cwd, 'templates'), ['.html'], callback);
			},
			function (node, callback) {
				var tasks = [];
				node.files().forEach(function (file) {
					file = path.join(cwd, file);
					tasks.push(function (callback) {
						fs.readFile(file, function (err, data) {
							callback(err, {
								data: data,
								path: file
							});
						});
					});
				});
				async.parallel(tasks, callback);
			},
			function (files, callback) {
				var output = [];
				files.forEach(function (file) {
					console.log('ngtemplate:' + 'read' + file.path);
					output.push(getTemplateScript(file));
				});
				output = BEFORE + output.join('\n') + AFTER;
				fs.writeFile(path.join(cwd, 'js/templates.js'), output, callback);
			}
		], function (err) {
			if (err) {
				console.log(err);
			}
			console.log('ngtemplate: end compile');
		});
	}

	module.exports = debounce(compile, WAIT);

})(module, require, process, console);
