(function () {
	'use strict';

	angular
		.module('main.balance')
		.controller('BalanceController', BalanceController);

	function BalanceController(ProductService, TripService, UserService, toastr, ErrorToast) {
		var vm = this;
		vm.products = [];
		vm.filteredProducts = [];

		vm.trips = [];
		vm.filteredTrips = [];

		vm.users = [];
		vm.selectedUsers = [];


		vm.total = 0;
		vm.profit = 0;
		vm.paid_amount = 0;
		vm.purchase_price = 0;

		TripService.query(function (data) {
			vm.trips = data;
			vm.filteredTrips = vm.trips;
			calculateTrips();
			newTripTotal();
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

		ProductService.query(function (data) {
			vm.products = data;
			vm.filteredProducts = vm.products;
			newProductTotal();
		}, function (error) {
			ErrorToast(error);
		});

		vm.filter = filter;

		function calculateTrips() {
			vm.trips_total = 0;
			vm.trips_profit = 0;
			vm.trips_paid_amount = 0;
			vm.trips_purchase_price = 0;
			vm.trips = vm.trips.map(function (trip) {
				trip.total = 0;
				trip.paid_amount = 0;
				trip.profit = 0;
				trip.purchase_price = 0;
				trip.groups = trip.groups.map(function (group) {
					group.total = 0;
					group.paid_amount = 0;
					group.profit = 0;
					group.purchase_price = 0;
					group.clients.forEach(function (client) {
						if (!client.products) return;
						group.total += client.products.total || 0;
						group.paid_amount += client.products.paid_amount || 0;
						group.purchase_price += client.products.purchase_price || 0;
						group.profit += (client.products.purchase_price || 0) + (client.products.purchase_price || 0) * ((client.products.total_profit || 0) / 100);
					});
					trip.total += group.total;
					trip.paid_amount += group.paid_amount;
					trip.profit += group.profit;
					trip.purchase_price += group.purchase_price;
					return group;
				});

				vm.trips_total += trip.total;
				vm.trips_profit += trip.profit;
				vm.trips_paid_amount += trip.paid_amount;
				vm.trips_purchase_price += trip.purchase_price;
				return trip;
			});
		}

		function recievedAmountProducts() {
			var paid_amount = 0;
			vm.filteredProducts.forEach(function (product) {
				paid_amount += (product.paid_amount || 0);
			});
			return paid_amount;
		}

		function profitAmountProducts() {
			var profit_amount = 0;
			vm.filteredProducts.forEach(function (product) {
				profit_amount += ((product.purchase_price * (product.total_profit / 100)) || 0);
			});
			return profit_amount;
		}

		function purchaseAmountProducts() {
			var purchase_amount = 0;
			vm.filteredProducts.forEach(function (product) {
				purchase_amount += ((product.purchase_price) || 0);
			});
			return purchase_amount;
		}

		function saleAmountProducts() {
			var sale_amount = 0;
			vm.filteredProducts.forEach(function (product) {
				sale_amount += ((product.purchase_price + product.purchase_price * (product.total_profit / 100)) || 0);
			});
			return sale_amount;
		}

		function newTripTotal() {
			vm.trips_total = 0;
			vm.trips_profit = 0;
			vm.trips_paid_amount = 0;
			vm.trips_purchase_price = 0;
			vm.filteredTrips.forEach(function (trip) {
				vm.trips_total += trip.total;
				vm.trips_profit += trip.profit;
				vm.trips_paid_amount += trip.paid_amount;
				vm.trips_purchase_price += trip.purchase_price;
				return trip;
			});

			vm.total += vm.trips_total;
			vm.profit += vm.trips_profit;
			vm.paid_amount += vm.trips_paid_amount;
			vm.purchase_price += vm.trips_purchase_price;
		}

		function newProductTotal() {
			vm.total += saleAmountProducts();
			vm.profit += profitAmountProducts();
			vm.paid_amount += recievedAmountProducts();
			vm.purchase_price += purchaseAmountProducts();
		}

		function filter() {
			if (vm.to_date && vm.from_date) {
				var to = vm.to_date.toJSON().slice(0, 10).replace(/-/g, '/');
				var from = vm.from_date.toJSON().slice(0, 10).replace(/-/g, '/');

				vm.filteredProducts = vm.products.filter(function (product) {
					var product_date = new Date(product.date).toJSON().slice(0, 10).replace(/-/g, '/');
					return product_date >= from && product_date <= to && (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(product.userId) : true);
				});

				vm.filteredTrips = vm.trips.filter(function (trip) {
					var trip_date = new Date(trip.date).toJSON().slice(0, 10).replace(/-/g, '/');
					return trip_date >= from && trip_date <= to && (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(trip.userId) : true);
				});


				vm.total = 0;
				vm.profit = 0;
				vm.paid_amount = 0;
				vm.purchase_price = 0;

				newTripTotal();
				newProductTotal();
			} else {
				vm.filteredProducts = vm.products.filter(function (product) {
					return (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(product.userId) : true);
				});

				vm.filteredTrips = vm.trips.filter(function (trip) {
					return (vm.selectedUsers.length > 0 ? vm.selectedUsers.includes(trip.userId) : true);
				});

				vm.total = 0;
				vm.profit = 0;
				vm.paid_amount = 0;
				vm.purchase_price = 0;

				newTripTotal();
				newProductTotal();
			}
		}
	}
})();