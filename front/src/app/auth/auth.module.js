(function () {
	'use strict';

	angular
		.module('Moussafir.auth', ['satellizer'])
		.config(config);

	function config($stateProvider, $authProvider, $windowProvider) {
		var $window = $windowProvider.$get();
		var api_endpoint = $window.localStorage['host'];
		$authProvider.loginUrl = api_endpoint + 'authentication';
		$authProvider.tokenPrefix = '';
		$authProvider.authHeader = 'Authorization';
		$authProvider.authToken = 'accessToken';

		$stateProvider
			.state('auth', {
				url: '/auth',
				templateUrl: 'app/auth/auth.html',
				controller: "AuthController",
				controllerAs: "vm"
			});
	}
})();