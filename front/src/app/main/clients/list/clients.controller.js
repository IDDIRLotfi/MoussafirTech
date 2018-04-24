(function () {
	'use strict';

	angular.module('main.clients')
		.controller('ClientsController', ClientsController);

	function ClientsController(ClientService, ProductService, UserService, toastr, ErrorToast, dialogs) {
		var vm = this;

		vm.clients = [];
		vm.products = [];
		vm.filteredClients = [];
		vm.selectedTypes = [];
		vm.selectedUsers = [];
		vm.clientTypes = [
			"Particulier",
			"Agence de voyage",
			"Entreprise",
			"Autre"
		]

		ProductService.query(function (data) {
			vm.products = data;
			getClients();
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

		vm.deleteClient = deleteClient;
		vm.filter = filter;
		vm.getClientProducts = getClientProducts;

		function filter() {
			vm.filteredClients = vm.clients.filter(function (client) {
				return (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(client.userId) : true) && (vm.withRest ? client.rest > 0 : true) && (vm.selectedTypes.length > 0 ? vm.selectedTypes.includes(client.type) : true);
			})
		}

		function getClients() {
			ClientService.query(function (data) {
				vm.clients = data;
				vm.clients.forEach(function (client) {
					client.sales = 0;
					client.rest = 0;
					vm.products.forEach(function (product) {
						if (product.client === client._id) {
							client.sales += product.total || 0;
							client.rest += (product.total - product.paid_amount) || 0;
						}
					});
				});
				vm.filteredClients = vm.clients;
			}, function (error) {
				ErrorToast(error);
			});
		}

		function deleteClient(clientId) {
			var dialog = dialogs.confirm('Confirmation', 'Vous allez supprimer le client!', {
				keyboard: true
			});
			dialog.result.then(function () {
				ClientService.delete({
					clientId: clientId
				}, function (data) {
					toastr.success('Le client a été supprimer avec succès', 'Succès');
					for (var i = 0; i < vm.clients.length; i++) {
						if (vm.clients[i]._id === clientId) {
							vm.clients.splice(i, 1);
							break;
						}
					}
				}, function (error) {
					ErrorToast(error);
				})
			});
		}

		function getClientProducts(client) {
			vm.clientProducts = vm.products.filter(function (product) {
				return product.client === client._id;
			});

			dialogs.create('app/main/clients/list/dialogs/products-dialog.html', 'ClientProductsController', {
				products: vm.clientProducts,
				client: client
			}, {
				keyboard: true,
				size: 'md'
			}, 'dialogVm');
		}
	}
})();