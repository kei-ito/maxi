/* global window */
(function (window) {
	'use strict';
	window
		.angular
		.module('a')
		.factory('projects', [
			'ajax', 'notify', 'confirm', 'download', '$state',
			function (ajax, notify, confirm, download, $state) {
				var list = [];
				function save(filepath, src) {
					notify('保存しています');
					return ajax.put('/projects/' + filepath, src, {
						headers: {
							'Content-Type': 'text/plain; charset=utf-8'
						}
					}).then(function () {
						notify('保存しました');
					});
				}
				function updateList() {
					return ajax.get('/projects').then(function (result) {
						list.splice(0, list.length);
						(result.data || []).forEach(function (project) {
							list.push(project);
						});
						return list;
					});
				}
				function create(name) {
					return ajax.post('/projects', {
						name: name
					}).then(function () {
						notify('プロジェクト "' + name + '" を作成しました');
						return false;
					}, function () {
						notify('プロジェクトを作成できませんでした');
						return true;
					});
				}
				function getSrc(filepath) {
					notify('読み込み中です');
					return ajax.get('/projects/' + filepath, null, {
						transformResponse: function (data) {
							notify('読み込みました');
							return data || '';
						}
					}).then(function (result) {
						var headers = result.headers();
						return {
							body: result.data,
							mode: headers['x-mode'],
							readOnly: headers['x-read-only'] === '1',
							previewUrl: headers['x-preview-url']
						};
					});
				}
				function getFiles(name) {
					return ajax.get('/projects/' + name).then(function (result) {
						return result.data;
					}, function () {
						$state.go('home');
					});
				}
				function deleteItem(path) {
					confirm(path + 'を削除します。<br>よろしいですか？', [
						'キャンセル',
						'削除'
					]).then(function (value) {
						if (value === '削除') {
							ajax.del('/projects/' + path).then(function (result) {
								notify(path + ' を削除しました');
								return result.data;
							});
						}
					});
				}
				function renameItem(path, newName) {
					return ajax.patch('/projects/' + path, {
						newName: newName
					}).then(function (result) {
						notify('名前を変更しました');
						return result.data;
					});
				}
				function createFile(path) {
					return ajax.post('/projects/' + path, {
						type: 'file'
					}).then(function (result) {
						notify('ファイル ' + path + ' を作成しました');
						return result.data;
					});
				}
				function createDirectory(path) {
					return ajax.post('/projects/' + path, {
						type: 'directory'
					}).then(function (result) {
						notify('フォルダ ' + path + ' を作成しました');
						return result.data;
					});
				}
				function deleteProject(projectName) {
					confirm('この操作は元に戻せません。よろしいですか？', [
						'キャンセル',
						'プロジェクトを削除'
					]).then(function (value) {
						if (value === 'プロジェクトを削除') {
							ajax
								.del('/projects/' + projectName)
								.then(function () {
									$state.go('home');
									notify('プロジェクトを削除しました');
								});
						}
					});
				}
				function downloadZip(projectName) {
					return ajax.get('/download/' + projectName).then(function (result) {
						download(result.data.url, projectName + '.zip');
					});
				}
				function move(from, to) {
					return ajax.patch('/projects/' + from, {
						newPath: to
					}).then(function (result) {
						notify('移動しました');
						return result.data;
					});
				}
				function upload(path, files) {
					return ajax.put('/projects/' + path, files);
				}
				return {
					list: list,
					updateList: updateList,
					create: create,
					getFiles: getFiles,
					deleteItem: deleteItem,
					renameItem: renameItem,
					createFile: createFile,
					createDirectory: createDirectory,
					deleteProject: deleteProject,
					download: downloadZip,
					getSrc: getSrc,
					save: save,
					move: move,
					upload: upload
				};
			}
		]);
})(window);
