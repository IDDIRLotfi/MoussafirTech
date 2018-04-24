(function () {
	'use strict';

	angular
		.module('main.products')
		.controller('ProductsController', ProductsController);

	function ProductsController(ProductService, ClientService, UserService, toastr, dialogs, ErrorToast) {
		var vm = this;

		vm.products = [];
		vm.clients = [];
		vm.users = [];
		vm.selectedUsers = [];
		vm.selectedTypes = [];
		vm.productTypes = [
			"Réservation d’hôtel",
			"Location",
			"Billet d’avion",
			"Assurance de voyage",
			"Transport routier",
			"Transport maritime",
			"Traitement de dossier de visa",
			"Autre"
		];
		vm.filtered_products = [];

		ProductService.query(function (data) {
			vm.products = data;
			var current_date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
			vm.products = vm.products.filter(function (product) {
				var product_date = new Date(product.date).toJSON().slice(0, 10).replace(/-/g, '/');
				return current_date === product_date;
			});
			ClientService.query(function (data) {
				vm.clients = data;
				vm.products = vm.products.map(function (product) {
					product.client = getClient(product.client);
					return product;
				});
				vm.filtered_products = vm.products;
			}, function (error) {
				ErrorToast(error);
			});
		}, function (error) {
			ErrorToast(error);
		});

		UserService.query(function (data) {
			vm.users = data;
			for (var i = 0; i < vm.users.length; i++) {
				if (vm.users[i].role === "super-admin") {
					vm.users.splice(i, 1);
					break;
				}
			}
		}, function (error) {
			ErrorToast(error);
		});

		vm.recievedAmount = recievedAmount;
		vm.restAmount = restAmount;
		vm.saleAmount = saleAmount;
		vm.getClient = getClient;
		vm.filter = filter;
		vm.deleteProduct = deleteProduct;

		function deleteProduct(productId) {
			var dialog = dialogs.confirm('Confirmation', 'Vous allez supprimer le produit!', {
				keyboard: true
			});
			dialog.result.then(function () {
				ProductService.delete({
					productId: productId
				}, function (data) {
					toastr.success('Le produit a été supprimer avec succès', 'Succès');
					for (var i = 0; i < vm.products.length; i++) {
						if (vm.products[i]._id === productId) {
							vm.products.splice(i, 1);
							break;
						}
					}
				}, function (error) {
					ErrorToast(error);
				})
			});
		}

		function recievedAmount() {
			var paid_amount = 0;
			vm.products.forEach(function (product) {
				paid_amount += (product.paid_amount || 0);
			});
			return paid_amount;
		}

		function restAmount() {
			var rest_amount = 0;
			vm.products.forEach(function (product) {
				rest_amount += ((product.total || 0) - (product.paid_amount || 0));
			});
			return rest_amount;
		}

		function saleAmount() {
			var sale_amount = 0;
			vm.products.forEach(function (product) {
				sale_amount += (((product.purchase_price || 0) + (product.purchase_price || 0) * ((product.total_profit || 0) / 100)) || 0);
			});
			return sale_amount;
		}

		function getClient(clientId) {
			return vm.clients.find(function (client) {
				return client._id === clientId
			});
		}

		function filter() {
			vm.filtered_products = vm.products.filter(function (product) {
				return (vm.selectedTypes.length > 0 ? vm.selectedTypes.includes(product.type) : true) && (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(product.userId) : true);
			});
		}
	}

})();