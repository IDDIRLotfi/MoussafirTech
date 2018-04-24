(function () {
	'use strict';

	angular
		.module('Moussafir.key')
		.controller('KeyController', KeyController);

	function KeyController($window, $cookies, $state, toastr) {
		var vm = this;

		//to be hashed to db and verify in the back
		vm.keys = [
			'XNBS-HAJW-9N0U-8XPJ-43IS-9YGV',
			'7CIA-43IS-9YGV-0P4C-HAJW-9N0U'
		];

		if (!$cookies.get('Moussafir') && !$window.localStorage['cookie_is_set']) {
			var expireDate = new Date();
			expireDate.setDate(expireDate.getDate() + 30);
			// trial version for 30 days
			$cookies.put('Moussafir', 'Trial version', {
				'expires': expireDate
			});
			$window.localStorage['cookie_is_set'] = true;
		}
		
		vm.getKey = getKey;
		vm.verifyKey = verifyKey;
		vm.checkTrial = checkTrial;

		function getKey() {
			return vm.keys.includes($window.localStorage['current_key']);
		}

		function verifyKey() {
			if (vm.keys.includes(vm.key)) {
				$window.localStorage['current_key'] = vm.key;
				vm.key = null;
				$state.go('auth');
			} else {
				toastr.error("La clé est incorrecte", 'Erreur');
			}
		}

		function checkTrial() {
			vm.hide = !$cookies.get('Moussafir');
			return (!$cookies.get('Moussafir') && $window.localStorage['cookie_is_set']);
		}
	}
})();