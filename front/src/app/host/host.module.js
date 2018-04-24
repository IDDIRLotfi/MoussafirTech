(function () {
	'use strict';

	angular
		.module('Moussafir.host', [])
		.config(config);

	function config($stateProvider) {
		$stateProvider
			.state('host', {
				url: '/host',
				templateUrl: 'app/host/host.html',
				controller: "HostController",
				controllerAs: "vm"
			});
	}
})();