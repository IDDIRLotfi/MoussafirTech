(function () {
	'use strict';

	angular
		.module('Moussafir')
		.run(run);

	function run($auth, $rootScope, $state, $location, $window, UserService, $transitions) {
		var user_id = $window.localStorage['current_user'];
		if (user_id) {
			UserService.get({
				userId: user_id
			}, function (user) {
				$rootScope.current_user = user;
				$rootScope.user_role = user.role;
			}, function (errors) {
				//ErrorToast(errors);
			});
		}

		$transitions.onStart({}, function (trans) {
			var notAllowedStates = ['/auth'];
			var toState = trans.to();
			var $state = trans.router.stateService;
			var authService = trans.injector().get('$auth');

			if (notAllowedStates.indexOf($location.url()) === -1)
				$rootScope.next = $location.url();

			if (authService.isAuthenticated()) {
				if (notAllowedStates.indexOf(toState['url']) !== -1) {
					return $state.target('dashboard');
				}
				if (toState['adminRequired']) {
					if ($rootScope.user_role !== 'admin' && $rootScope.user_role !== 'super-admin') {
						return $state.target('dashboard');
					}
				}
			} else {
				if (toState['loginRequired']) {
					return $state.target('auth');
				}
			}
		});
	}
})();