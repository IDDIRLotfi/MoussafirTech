(function () {
	'use strict';

	angular.module('main.clients')
		.controller('ClientController', ClientController);

	function ClientController($state, $stateParams, ClientService, toastr, ErrorToast) {
		var vm = this;

		vm.user = {
			partenaires: [],
			addresses: [null],
			phone_numbers: [null],
			fax_numbers: [null],
			web_sites: [null],
			emails: [null],
			passport: {}
		};
	
		vm.user.nbPart = 0;
		vm.user.nbPartner = 0;

		// Get state params (client id)
		vm.client_id = $stateParams.id;

		if (vm.client_id) {
			ClientService.get({
				clientId: vm.client_id
			}, function (data) {
				vm.user = data;
				// fixing date issues with strings
				vm.user.birthday = getDate(vm.user.birthday);
				vm.user.passport.issue_date = getDate(vm.user.passport.issue_date);
				vm.user.passport.expiration_date = getDate(vm.user.passport.expiration_date);
				if (vm.user.partenaires) {
					angular.forEach(vm.user.partenaires, function (partenaire) {
						partenaire.birthday = getDate(partenaire.birthday);
					});
				} else {
					vm.user.partenaires = [];
				}

			}, function (error) {
				ErrorToast(error);
			});
		}

		vm.save = save;
		vm.cancel = cancel;
		vm.range = range;

		function range(number) {
			return new Array(number);
		}

		function save(redirect) {
			(vm.client_id ? updateUser : addUser)(redirect);
		}

		function addUser(redirect) {
			vm.user.date = (new Date()).toISOString();
			ClientService.save(vm.user, function (data) {
				vm.user._id = data._id;
				vm.client_id = data._id;
				toastr.success('Le client a été ajouter avec succès', 'Succès');
				if (redirect) $state.go("clients_list");
			}, function (error) {
				ErrorToast(error);
			});
		}

		function updateUser(redirect) {
			vm.user.date = vm.user.date || (new Date()).toISOString();
			ClientService.update({
				clientId: vm.client_id
			}, vm.user, function (data) {
				toastr.success('Le client a été modifier avec succès', 'Succès');
				if (redirect) $state.go("clients_list");
			}, function (error) {
				ErrorToast(error);
			});
		}

		function cancel() {
			$state.go("clients_list");
		}

		function getDate(stringDate) {
			return stringDate ? new Date(stringDate) : NaN;
		}
	}
})();