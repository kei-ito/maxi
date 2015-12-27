/* global require, process */
(function (require, process) {
	var path = require('path');
	var URL = require('url');
	var querystring = require('querystring');
	var bs = require('browser-sync').create();
	var cwd = process.cwd();
	var callAPI = require('./bs/call-api');
	var bsConfig = {
		open: false,
		server: {
			baseDir: [
				cwd
			],
			middleware: function (req, res, next) {
				var url = req.url;
				if (/^\/api/.test(url)) {
					url = URL.parse(req.url);
					req.params = querystring.parse(url.query);
					return callAPI(req, res);
				}
				return next();
			}
		}
	};
	bs.watch(path.join(cwd, 'index.html'), bs.reload);
	bs.watch(path.join(cwd, 'js/**/*.js'), bs.reload);
	bs.watch(path.join(cwd, 'css/**/*.css'), function (event, file) {
		bs.reload(file);
	});
	bs.watch(path.join(cwd, 'css/*.styl'), require('./bs/uicss'));
	bs.watch(path.join(cwd, 'templates/**/*.html'), require('./bs/uitemplate'));
	bs.init(bsConfig);
})(require, process);
