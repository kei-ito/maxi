/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.run([
			'$templateCache',
			function($templateCache) {
				$templateCache.put('home', '<p ng-show="home.loading">Loading...</p><p ng-hide="home.loading">Select a object</p><ul class="ObjectList"><li class="ObjectListHeader"><a><div>No.</div><div>RA, Dec</div><div>JNAME</div><div>CNAME</div><div>l, b</div><div>Category</div><div>SubCategory</div></a></li><li ng-hide="object.isHeader" to-state="object({name:object.JNAME})" ng-repeat="object in home.list"><div>{{object[\'No.\']}}</div><div>{{object.RA}}, {{object.Dec}}</div><div>{{object.JNAME}}</div><div>{{object.CNAME}}</div><div>{{object.l}}, {{object.b}}</div><div>{{object.Category}}</div><div>{{object.Subcategory}}</div></li></ul><div class="btnRow"><button on-click="home.clearCache()">Clear Cache</button></div>');
				$templateCache.put('object', '<p ng-show="object.loading">Loading...</p><p ng-show="object.drawing && !object.loading">Drawing...</p><p ng-hide="object.drawing || object.loading">Data</p><canvas data-graph></canvas><p>Options</p><ul><li data-checker="object.bands._2_20" on-click="object.toggleBand(\'_2_20\')">2-20keV</li><li data-checker="object.bands._2_4" on-click="object.toggleBand(\'_2_4\')">2-4keV</li><li data-checker="object.bands._4_10" on-click="object.toggleBand(\'_4_10\')">4-10keV</li><li data-checker="object.bands._10_20" on-click="object.toggleBand(\'_10_20\')">10-20keV</li><li class="ListItem_Counter"><div>Bin (day)</div><button on-click="object.decrementBin()">−</button> <input class="Label" type="number" ng-model="object.bin" min="1"> <button on-click="object.incrementBin()">＋</button></li></ul><p ng-show="object.loading">Loading...</p><p ng-hide="object.loading">Object information</p><ul class="ObjectInfo"><li ng-repeat="(key, value) in object.info"><div>{{key}}</div><div>{{value}}</div></li></ul>');
			}
		]);
})(window);