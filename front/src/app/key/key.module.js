(function () {
	'use strict';

	angular
		.module('Moussafir.key', [])
		.config(config);

	function config($stateProvider) {
		$stateProvider
			.state('key', {
				url: '/key',
				templateUrl: 'app/key/key.html',
				controller: "KeyController",
				controllerAs: "vm"
			});
	}
})();