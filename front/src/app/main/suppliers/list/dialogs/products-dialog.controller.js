(function () {
	'use strict';

	angular.module('main.suppliers')
		.controller('SupplierProductsController', SupplierProductsController);

	function SupplierProductsController($uibModalInstance, data, $state) {
		var vm = this;
		vm.products = data.products;
		vm.supplier = data.supplier;

		vm.cancel = function () {
			$uibModalInstance.dismiss('Canceled');
		};

		vm.showProduct = function (producId) {
			$uibModalInstance.dismiss('Canceled');
			$state.go('edit_product', {
				id: producId
			});
		}
	}
})();