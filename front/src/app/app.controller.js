(function () {
	'use strict';

	angular
		.module('Moussafir')
		.controller('AppController', AppController);

	function AppController($window, $cookies, $state) {
		var vm = this;
		startTimer();

		function checkKey() {
			if (!$window.localStorage['host']) {
				$state.go('host');
			}
			if (!$cookies.get('Moussafir') || !$window.localStorage['cookie_is_set'] ||
				!$window.localStorage['current_key']) {
				$state.go('key');
			};
		}

		function startTimer() {
			vm.worker = new Worker("timer.js");
			vm.worker.onmessage = function (event) {
				vm.timer = event.data;
				checkKey();
			}
		}

		function stopTimer() {
			vm.worker.terminate();
			vm.worker = undefined;
		}
	}
})();