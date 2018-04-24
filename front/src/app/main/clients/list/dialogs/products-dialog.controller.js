(function () {
	'use strict';

	angular.module('main.clients')
		.controller('ClientProductsController', ClientProductsController);

	function ClientProductsController($uibModalInstance, data, $state) {
		var vm = this;
		vm.products = data.products;
		vm.client = data.client;

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