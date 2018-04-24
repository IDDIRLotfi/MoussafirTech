(function () {
	'use strict';

	angular
		.module('main.products')
		.controller('ProductController', ProductController);

	function ProductController($stateParams, $state, ProductService,
		CalculationService, ClientService, SupplierService, toastr, ErrorToast) {

		var vm = this;

		vm.showHotelForm = false;
		vm.showPlaneTicketForm = false;
		vm.showShipTicketForm = false;
		vm.showInsurenceForm = false;
		vm.showOtherForm = false;
		vm.showConsulatForm = false;
		vm.showRendezVousForm = false;
		vm.new_client = {
			type: "Particulier",
			addresses: [null],
			phone_numbers: [null],
			fax_numbers: [null],
			web_sites: [null],
			emails: [null],
			passport: {}
		};
		vm.new_supplier = {
			addresses: [null],
			responsibles: [{
				addresses: [null],
				phone_numbers: [null],
				fax_numbers: [null],
				web_sites: [null],
				emails: [null],
				skypes: [null],
				faxes: [null]
			}]
		};

		vm.clients = [];
		vm.suppliers = [];
		vm.companies = [];
		// TODO: initialise on selection changed
		//Initialisation
		vm.product = {
			occupants: [],
			stay: {},
			visa: {
				products: [],
				hotel: {}
			},
			destination: "",
			hotel: {
				nb_rooms: 1,
				occupants: {}
			},
			plane_ticket: {
				nb_stops: 0,
				occupants: {}
			},
			road_transport: {
				nb_stops: 0,
				occupants: {}
			},
			ranting: {
				occupants: {}
			},
			ship_ticket: {
				occupants: {}
			},
			travel_insurence: {
				occupants: {}
			}
		};

		vm.products = [{
				id: 1,
				name: 'Hébergement',
			},
			{
				id: 2,
				name: 'Billet d’avion',
			},
			{
				id: 3,
				name: 'Assurance de voyage',
			},
			{
				id: 4,
				name: 'Consulat',
			},
			{
				id: 5,
				name: 'Prendre le rendez-vous',
			},
			{
				id: 6,
				name: 'Autre',
			}
		];

		vm.supplierProducts = [{
				name: "Réservation d’hôtel"
			}, {
				name: "Location"
			}, {
				name: "Billet d’avion"
			}, {
				name: "Assurance de voyage"
			},
			{
				name: "Traitement de dossier de visa"
			}, {
				name: "Produits E-tourisme"
			}, {
				name: "Voyage Organisé"
			},
			{
				name: "Transport routier"
			}, {
				name: "Transport maritime"
			}, {
				name: "Transfert"
			}, {
				name: "Autre"
			}
		];

		vm.product_id = $stateParams.id;

		// if product update
		if (vm.product_id) {
			ProductService.get({
				productId: vm.product_id
			}, function (data) {
				vm.product = data;
				updateProductInfo();
			}, function (error) {
				ErrorToast(error);
			});
		} else {
			// fetch clients
			ClientService.query(function (data) {
				vm.clients = data;
			}, function (error) {
				ErrorToast(error);
			});
		}

		// fetch suppliers
		SupplierService.query(function (data) {
			vm.suppliers = data;
			vm.companies = vm.suppliers.filter(function (supplier) {
				return supplier.type !== 'Intermédiaire';
			});
		}, function (error) {
			ErrorToast(error);
		});

		CalculationService.init(function () {
			return {
				product: vm.product,
				rooms: vm.rooms,
				occupant: occupant,
				showHotelForm: vm.showHotelForm,
				showPlaneTicketForm: vm.showPlaneTicketForm,
				showShipTicketForm: vm.showShipTicketForm,
				showInsurenceForm: vm.showInsurenceForm,
				showOtherForm: vm.showOtherForm,
				showConsulatForm: vm.showConsulatForm,
				showRendezVousForm: vm.showRendezVousForm
			}
		})

		vm.subDates = subDates;
		vm.supplierType = supplierType;
		vm.range = range;
		vm.update = update;
		vm.updateAll = updateAll;
		vm.cancel = cancel;
		vm.save = save;
		vm.getRooms = getRooms;
		vm.updateForms = updateForms;
		vm.contains = contains;
		vm.occupant = occupant;
		vm.saveClient = saveClient;
		vm.saveSupplier = saveSupplier;
		vm.getNights = getNights;
		vm.hotelPriceByOccupant = CalculationService.hotelPriceByOccupant;
		vm.hotelPriceByRoom = CalculationService.hotelPriceByRoom;
		vm.hotelTotalPriceByRoom = CalculationService.hotelTotalPriceByRoom;
		vm.totalPrice = CalculationService.totalPrice;
		vm.roadPriceByOccupant = CalculationService.roadPriceByOccupant;
		vm.planePriceByOccupant = CalculationService.planePriceByOccupant;
		vm.insurencePriceByOccupant = CalculationService.insurencePriceByOccupant;
		vm.ratingPriceByOccupant = CalculationService.ratingPriceByOccupant;
		vm.shipPriceByOccupant = CalculationService.shipPriceByOccupant;

		function range(number) {
			return new Array(number);
		}

		function subDates(from, to) {
			if (!from || !to) return 0;
			return moment.duration(moment(to).diff(moment(from))).asDays();
		}

		function getNights(from, to) {
			var nights = subDates(from, to) - 1;
			return (nights === -1) ? 0 : nights;
		}

		function supplierType(supplierId) {
			var supplier = vm.suppliers.find(function (sup) {
				return sup._id === supplierId;
			});
			return supplier ? supplier.type : null;
		}

		function update(field, name) {
			if (vm.product[field].all) {
				angular.forEach(vm.product[field].occupants, (function (element) {
					element[name] = vm.product[field][name];
				}));
			}
		}

		function updateAll(field) {
			if (vm.product[field].all) {
				angular.forEach(vm.product[field].occupants, (function (element) {
					element['profit'] = vm.product[field]['profit'];
					element['unit_price'] = vm.product[field]['unit_price'];
				}));
			}
		}

		function cancel() {
			$state.go("products_list");
		}

		function save(redirect) {
			(vm.product_id ? updateProduct : addProduct)(redirect);
		}

		function addProduct(redirect) {
			vm.product.date = (new Date()).toISOString();
			ProductService.save(vm.product, function (data) {
				toastr.success('Le produit a été ajouter avec succès', 'Succès');
				vm.product._id = data._id;
				vm.product_id = data._id;
				if (redirect) $state.go("products_list");
			}, function (error) {
				ErrorToast(error);
			});
		}

		function updateProduct(redirect) {
			vm.product.date = vm.product.date || (new Date()).toISOString();
			ProductService.update({
				productId: vm.product_id
			}, vm.product, function (data) {
				toastr.success('Le produit a été modifier avec succès', 'Succès');
				if (redirect) $state.go("products_list");
			}, function (error) {
				ErrorToast(error);
			});
		}

		function getRooms() {
			vm.rooms = [];
			angular.forEach(vm.product.hotel.occupants, (function (value, key) {
				if (!vm.rooms.includes(value.room_number) && value.room_number && vm.occupant(key))
					vm.rooms.push(value.room_number);
			}));
			return vm.rooms;
		}

		function updateForms() {
			vm.showHotelForm = (contains('Hébergement') && vm.product.visa.hotel.accommodation_type && vm.product.visa.hotel.accommodation_type !== 'Autre');
			vm.showInsurenceForm = contains('Assurance de voyage');
			vm.showPlaneTicketForm = contains('Billet d’avion');
			vm.showShipTicketForm = contains('Billet de bateau');
			vm.showConsulatForm = contains('Consulat');
			vm.showRendezVousForm = contains('Prendre le rendez-vous');
			vm.showOtherForm = contains('Autre');
		}

		function contains(string) {
			for (var i = 0; i < vm.product.visa.products.length; i++) {
				if (vm.product.visa.products[i].name === string) {
					return true;
				}
			}
			return false;
		}

		function getDate(stringDate) {
			return stringDate ? new Date(stringDate) : NaN;
		}

		function occupant(id) {
			return vm.clients.find(function (elem) {
				return elem._id === id
			});
		}

		function updateProductInfo() {
			vm.product.stay.start_date = getDate(vm.product.stay.start_date);
			vm.product.stay.end_date = getDate(vm.product.stay.end_date);

			if (vm.product.type === 'Transport maritime') {
				vm.product.ship_ticket.departure_date_from = getDate(vm.product.ship_ticket.departure_date_from);
				vm.product.ship_ticket.departure_time_from = getDate(vm.product.ship_ticket.departure_time_from);
				vm.product.ship_ticket.arrival_date_from = getDate(vm.product.ship_ticket.arrival_date_from);
				vm.product.ship_ticket.arrival_time_from = getDate(vm.product.ship_ticket.arrival_time_from);
			}

			if (vm.product.type === 'Billet d’avion') {
				vm.product.plane_ticket.departure_date_from = getDate(vm.product.plane_ticket.departure_date_from);
				vm.product.plane_ticket.departure_time_from = getDate(vm.product.plane_ticket.departure_time_from);
				vm.product.plane_ticket.arrival_date_from = getDate(vm.product.plane_ticket.arrival_date_from);
				vm.product.plane_ticket.arrival_time_from = getDate(vm.product.plane_ticket.arrival_time_from);

				vm.product.plane_ticket.departure_date_to = getDate(vm.product.plane_ticket.departure_date_to);
				vm.product.plane_ticket.departure_time_to = getDate(vm.product.plane_ticket.departure_time_to);
				vm.product.plane_ticket.arrival_date_to = getDate(vm.product.plane_ticket.arrival_date_to);
				vm.product.plane_ticket.arrival_time_to = getDate(vm.product.plane_ticket.arrival_time_to);
			}

			// fetch clients
			ClientService.query(function (data) {
				vm.clients = data;
			}, function (error) {
				ErrorToast(error);
			});

			if (vm.product.type === 'Traitement de dossier de visa') {
				vm.products = vm.products.map(function (product) {
					if (contains(product.name)) {
						product.ticked = true;
					}
					return product;
				});
				updateForms();
			}
		}

		function saveClient() {
			ClientService.save(vm.new_client, function (data) {
				toastr.success('Le client a été ajouter avec succès', 'Succès');
				vm.clients.push(data);
				vm.addClient = false;
				vm.new_client = {
					type: "Particulier",
					addresses: [null],
					phone_numbers: [null],
					fax_numbers: [null],
					web_sites: [null],
					emails: [null],
					passport: {}
				};
			}, function (error) {
				ErrorToast(error);
			});
		}

		function saveSupplier() {
			SupplierService.save(vm.new_supplier, function (data) {
				toastr.success('Le fournisseur a été ajouter avec succès', 'Succès');
				vm.suppliers.push(data);
				vm.addSupplier = false;
				vm.new_supplier = {
					addresses: [null],
					responsibles: [{
						addresses: [null],
						phone_numbers: [null],
						fax_numbers: [null],
						web_sites: [null],
						emails: [null],
						skypes: [null],
						faxes: [null]
					}]
				};
			}, function (error) {
				ErrorToast(error);
			});
		}

	}
})();