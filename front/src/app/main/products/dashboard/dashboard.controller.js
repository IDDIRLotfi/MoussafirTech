(function () {
	'use strict';

	angular
		.module("main.products")
		.controller("DashboardController", DashboardController);

	function DashboardController(ProductService, ClientService, UserService, toastr, $window, $state, dialogs, ErrorToast) {
		var vm = this;

		vm.products = [];
		vm.clients = [];
		vm.selectedTypes = [];
		vm.users = [];
		vm.selectedUsers = [];
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
			ClientService.query(function (data) {
				vm.clients = data;
				vm.products = vm.products.map(function (product) {
					product.client = getClient(product.client);
					return product;
				});
			}, function (error) {
				ErrorToast(error);
			})
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
		vm.profitAmount = profitAmount;
		vm.purchaseAmount = purchaseAmount;
		vm.saleAmount = saleAmount;
		vm.filter = filter;
		vm.getClient = getClient;
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
			var products = vm.filtered_products.length > 0 ? vm.filtered_products : vm.products;
			products.forEach(function (product) {
				paid_amount += (product.paid_amount || 0);
			});
			return paid_amount;
		}

		function restAmount() {
			var rest_amount = 0;
			var products = vm.filtered_products.length > 0 ? vm.filtered_products : vm.products;
			products.forEach(function (product) {
				rest_amount += ((product.total || 0) - (product.paid_amount || 0));
			});
			return rest_amount;
		}

		function profitAmount() {
			var profit_amount = 0;
			var products = vm.filtered_products.length > 0 ? vm.filtered_products : vm.products;
			products.forEach(function (product) {
				profit_amount += ((product.purchase_price || 0) * (product.total_profit || 0) / 100);
			});
			return profit_amount;
		}

		function purchaseAmount() {
			var purchase_amount = 0;
			var products = vm.filtered_products.length > 0 ? vm.filtered_products : vm.products;
			products.forEach(function (product) {
				purchase_amount += (product.purchase_price || 0);
			});
			return purchase_amount;
		}

		function saleAmount() {
			var sale_amount = 0;
			var products = vm.filtered_products.length > 0 ? vm.filtered_products : vm.products;
			products.forEach(function (product) {
				sale_amount += ((product.purchase_price || 0) + (product.purchase_price || 0) * ((product.total_profit || 0) / 100));
			});
			return sale_amount;
		}

		function getClient(clientId) {
			return vm.clients.find(function (client) {
				return client._id === clientId
			});
		}

		function filter() {
			if (vm.to_date && vm.from_date) {
				var to = vm.to_date.toJSON().slice(0, 10).replace(/-/g, '/');
				var from = vm.from_date.toJSON().slice(0, 10).replace(/-/g, '/');

				vm.filtered_products = vm.products.filter(function (product) {
					var product_date = new Date(product.date).toJSON().slice(0, 10).replace(/-/g, '/');
					return product_date >= from && product_date <= to && (vm.selectedTypes.length > 0 ? vm.selectedTypes.includes(product.type) : true) && (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(product.userId) : true);
				});
			}
		}
	}
})();