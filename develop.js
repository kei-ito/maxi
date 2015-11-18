/* global require, process */
(function (require, process) {
	var path = require('path');
	var bs = require('browser-sync').create();
	var cwd = process.cwd();
	var bsConfig = {
		open: false,
		server: {
			baseDir: [
				cwd
			]
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
