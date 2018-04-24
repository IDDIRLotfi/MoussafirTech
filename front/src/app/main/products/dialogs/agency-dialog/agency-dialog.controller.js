(function () {
	'use strict';

	angular.module('main.products')
		.controller('AgencyDialogController', AgencyDialogController);

	function AgencyDialogController($uibModalInstance) {
		var vm = this;
		vm.agency_logo = {};
		vm.agency_info = {};

		vm.cancel = function () {
			$uibModalInstance.dismiss('Canceled');
		};

		function getBase64(file, callback) {
			vm.reader = new FileReader();
			vm.reader.readAsDataURL(file);
			vm.reader.onload = callback;
		}


		vm.print = function () {
			getBase64(vm.agency_logo, function () {
				$uibModalInstance.close({
					agency_logo: angular.copy(vm.reader.result),
					agency_info: vm.agency_info
				});
			});
		}
	}
})();