(function () {
	'use strict';

	angular
		.module('Moussafir.auth')
		.controller('AuthController', AuthController);

	function AuthController($window, $state, $auth, $rootScope, toastr, ErrorToast, $uiRouter) {
		var vm = this;

		// use local strategy to authenticate and get jwt
		vm.user = {
			strategy: 'local'
		};

		vm.login = login;
		var api_endpoint = $window.localStorage['host'];

		function login() {
			vm.disableLogin = true;
			$auth.login(vm.user, {
				url: api_endpoint + 'authentication'
			}).then(function (response) {
				if (!response.data.errors) {
					toastr.success('Connexion avec succès', 'Succès');
					$window.localStorage['token'] = response.data.accessToken;
					$window.localStorage['current_user'] = response.data.user._id;
					vm.user = {};
					$state.go("dashboard");
					var user = response.data.user;
					$rootScope.current_user = user;
					$rootScope.user_role = user.role;
				} else {
					ErrorToast(response.data.errors);
				}
				vm.disableLogin = false;
			}, function (response) {
				ErrorToast(response);
				vm.disableLogin = false;
			});
		}
	}
})();