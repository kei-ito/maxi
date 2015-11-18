/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.run([
			'$templateCache',
			function($templateCache) {
				$templateCache.put('home', '<p ng-show="home.loading">Loading...</p><p ng-hide="home.loading">Select a object</p><ul class="ObjectList"><li class="ObjectListHeader"><a><div>No.</div><div>RA, Dec</div><div>JNAME</div><div>CNAME</div><div>l, b</div><div>Category</div><div>SubCategory</div></a></li><li ng-hide="object.isHeader" to-state="object({name:object.JNAME})" ng-repeat="object in home.list"><div>{{object[\'No.\']}}</div><div>{{object.RA}}, {{object.Dec}}</div><div>{{object.JNAME}}</div><div>{{object.CNAME}}</div><div>{{object.l}}, {{object.b}}</div><div>{{object.Category}}</div><div>{{object.Subcategory}}</div></li></ul>');
				$templateCache.put('object', '<p ng-show="object.loading">Loading...</p><p ng-show="object.drawing && !object.loading">Drawing...</p><p ng-hide="object.drawing || object.loading">Data</p><canvas data-graph></canvas><div class="btnRow"><button on-click="object.draw()">re-draw</button></div><p ng-show="object.loading">Loading...</p><p ng-hide="object.loading">Object information</p><ul class="ObjectInfo"><li ng-repeat="(key, value) in object.info"><div>{{key}}</div><div>{{value}}</div></li></ul>');
			}
		]);
})(window);