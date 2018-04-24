(function () {
	'use strict';

	angular.module('main.suppliers')
		.controller('SuppliersController', SuppliersController);

	function SuppliersController(SupplierService, ProductService, UserService, toastr, dialogs, ErrorToast) {
		var vm = this;

		vm.suppliers = [];
		vm.filteredSuppliers = [];
		vm.selectedUsers = [];
		vm.selectedTypes = [];
		vm.products = [];
		vm.supplierTypes = [
			"Agence de voyage",
			"Plateforme B to B",
			"Hôtel",
			"Compagnie aérienne",
			"Compagnie maritime",
			"Compagnie transport routière",
			"Compagnie d’assurance",
			"Entreprise",
			"Amadeus",
			"Autre"
		]

		ProductService.query(function (data) {
			vm.products = data;
			getSuppliers();
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

		vm.deleteSupplier = deleteSupplier;
		vm.filter = filter;
		vm.getSupplierProducts = getSupplierProducts;

		function filter() {
			vm.filteredSuppliers = vm.suppliers.filter(function (supplier) {
				return (vm.selectedTypes.length > 0 ? vm.selectedTypes.includes(supplier.activity) : true) && (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(supplier.userId) : true);
			});
		}

		function getSuppliers() {
			SupplierService.query(function (data) {
				vm.suppliers = data;
				vm.suppliers.forEach(function (supplier) {
					supplier.purchases = 0;
					vm.products.forEach(function (product) {
						if (product.supplier === supplier._id) {
							supplier.purchases += product.purchase_price || 0;
						}
					});
				});
				vm.filteredSuppliers = vm.suppliers;
			}, function (error) {
				ErrorToast(error);
			});
		}

		function deleteSupplier(supplierId) {
			var dialog = dialogs.confirm('Confirmation', 'Vous allez supprimer le fournisseur!', {
				keyboard: true
			});
			dialog.result.then(function () {
				SupplierService.delete({
					supplierId: supplierId
				}, function (data) {
					toastr.success('Le fournisseur a été supprimer avec succès', 'Succès');
					for (var i = 0; i < vm.suppliers.length; i++) {
						if (vm.suppliers[i]._id === supplierId) {
							vm.suppliers.splice(i, 1);
							break;
						}
					}
				}, function (error) {
					ErrorToast(error);
				})
			});
		}

		function getSupplierProducts(supplier) {
			vm.supplierProducts = vm.products.filter(function (product) {
				if (product.type !== "Traitement de dossier de visa") {
					return product.supplier === supplier._id;
				} else if (product.visa === null) {
					if (contains('Hébergement')) {
						return product.visa.hotel.accommodation_type === 'Autre' ? (visa.hotel.supplier === supplier._id) : product.hotel.supplier === supplier._id;
					} else if (contains('Assurance de voyage')) {
						return product.travel_insurence.supplier === supplier._id;
					} else if (contains('Billet d’avion')) {
						return product.plane_ticket.supplier === supplier._id;
					} else if (contains('Billet de bateau')) {
						return product.ship_ticket.supplier === supplier._id;
					} else if (contains('Consulat')) {
						return product.consulat.supplier === supplier._id;
					} else if (contains('Prendre le rendez-vous')) {
						return product.rendez_vous.supplier === supplier._id;
					} else if (contains('Autre')) {
						return product.other.supplier === supplier._id;
					}
				}
			});

			function contains(product, string) {
				for (var i = 0; i < product.visa.products.length; i++) {
					if (product.visa.products[i].name === string) {
						return true;
					}
				}
				return false;
			}

			dialogs.create('app/main/suppliers/list/dialogs/products-dialog.html', 'SupplierProductsController', {
				products: vm.supplierProducts,
				supplier: supplier
			}, {
				keyboard: true,
				size: 'md'
			}, 'dialogVm');
		}
	}
})();