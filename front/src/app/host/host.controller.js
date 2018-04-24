(function () {
	'use strict';

	angular
		.module('Moussafir.host')
		.controller('HostController', HostController);

	function HostController($window, $state, toastr, $cookies) {
		var vm = this;

		vm.setHost = setHost;

		function setHost() {
			if (vm.host) {
				$window.localStorage['host'] = "http://" + vm.host + ":3030/";
				if (!$cookies.get('Moussafir') || !$window.localStorage['cookie_is_set'] ||
					!$window.localStorage['current_key']) {
					$state.go('key');
				} else $state.go('auth');
			}
		}
	}
})();