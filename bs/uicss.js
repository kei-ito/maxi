/* global module, require, process, console */
(function (module, require, process, console) {

	'use strict';

	var WAIT = 200;
	var fs = require('fs');
	var path = require('path');
	var async = require('async');
	var stylus = require('stylus');
	var postcss = require('postcss');
	var autoprefixer = require('autoprefixer');
	var processor = postcss([autoprefixer]);
	var cwd = process.cwd();
	var debounce = require('../util/debounce');

	function compile() {
		var stylPath = path.join(cwd, 'css/main.styl');
		var cssPath = path.join(cwd, 'css/main.css');
		console.log('stylus: start');
		async.waterfall([
			function (callback) {
				console.log('stylus: readFile ' + stylPath);
				fs.readFile(stylPath, callback);
			},
			function (data, callback) {
				console.log('stylus: compile ' + stylPath);
				stylus(data.toString())
					.set('paths', [path.join(cwd, 'css')])
					.set('filename', stylPath)
					.render(callback);
			},
			function (compiledCss, callback) {
				var result = processor.process(compiledCss);
				if (result.error) {
					callback(result.error);
				} else {
					console.log('stylus: writeFile ' + cssPath);
					fs.writeFile(cssPath, result.css, callback);
				}
			}
		], function (err) {
			if (err) {
				console.log(err);
			}
			console.log('stylus: end');
		});
	}

	module.exports = debounce(compile, WAIT);

})(module, require, process, console);
