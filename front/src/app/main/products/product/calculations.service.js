(function () {
	'use strict';

	angular
		.module('main.products')
		.factory('CalculationService', CalculationService);

	function CalculationService() {
		var vm = this;

		return {
			init: init,
			priceByOccupant: priceByOccupant,
			hotelPriceByOccupant: hotelPriceByOccupant,
			hotelPriceByRoom: hotelPriceByRoom,
			hotelTotalPriceByRoom: hotelTotalPriceByRoom,
			totalHotelPrice: totalHotelPrice,
			totalOtherPrice: totalOtherPrice,
			ratingPriceByOccupant: ratingPriceByOccupant,
			totalRatingPrice: totalRatingPrice,
			planePriceByOccupant: planePriceByOccupant,
			totalPlanePrice: totalPlanePrice,
			insurencePriceByOccupant: insurencePriceByOccupant,
			totalInsurencePrice: totalInsurencePrice,
			roadPriceByOccupant: roadPriceByOccupant,
			totalRoadTravelPrice: totalRoadTravelPrice,
			shipPriceByOccupant: shipPriceByOccupant,
			totalShipPrice: totalShipPrice,
			hotelVisaPrice: hotelVisaPrice,
			consulatVisaPrice: consulatVisaPrice,
			rendezVousPrice: rendezVousPrice,
			totalVisaPrice: totalVisaPrice,
			totalPrice: totalPrice
		}

		function init(fetch) {
			vm.fetch = fetch;
		}

		function fetch() {
			var object = vm.fetch();
			vm.product = object.product;
			vm.rooms = object.rooms;
			vm.occupant = object.occupant;

			vm.showHotelForm = object.showHotelForm;
			vm.showPlaneTicketForm = object.showPlaneTicketForm;
			vm.showShipTicketForm = object.showShipTicketForm;
			vm.showInsurenceForm = object.showInsurenceForm;
			vm.showOtherForm = object.showOtherForm;
			vm.showConsulatForm = object.showConsulatForm;
			vm.showRendezVousForm = object.showRendezVousForm;
		}


		function subDates(from, to) {
			if (!from || !to) return 0;
			return moment.duration(moment(to).diff(moment(from))).asDays();
		}

		function getNights(from, to) {
			var nights = subDates(from, to) - 1;
			return (nights === -1) ? 0 : nights;
		}

		// call on button clicked not ng-value
		function priceByOccupant(field, occupantId) {
			fetch();
			var occupant = vm.product[field].occupants[occupantId];
			if (!occupant) return 0;
			var unit_price = (occupant.unit_price || 0) || vm.product[field].unit_price;
			return (unit_price * ((100 - (occupant.discount || 0) + (occupant.supplement_percentage || 0)) / 100) +
				(occupant.supplement_amount || 0));
		}

		function hotelPriceByOccupant(occupantId) {
			return priceByOccupant('hotel', occupantId);
		}

		function hotelPriceByRoom(room) {
			var price = 0;
			angular.forEach(vm.product.hotel.occupants, function (occupant, id) {
				if (occupant.room_number === room && vm.occupant(id))
					price += hotelPriceByOccupant(id);
			});
			return price;
		}

		function hotelTotalPriceByRoom(room) {
			return (hotelPriceByRoom(room) * getNights(vm.product.stay.start_date, vm.product.stay.end_date)) || 0;
		}

		function totalHotelPrice() {
			var price = 0;

			for (var i = 0; i < vm.rooms.length; i++) {
				price += hotelTotalPriceByRoom(vm.rooms[i]);
			}

			return price;
		}

		function totalOtherPrice() {
			fetch();
			if (!vm.product.other) return 0;
			return (vm.product.other.unit_price * (1 + (vm.product.other.profit / 100)) * vm.product.other.quantity) || 0
		}

		function ratingPriceByOccupant(occupantId) {
			return priceByOccupant('ranting', occupantId);
		}

		function totalRatingPrice() {
			var price = 0;
			angular.forEach(vm.product.ranting.occupants, function (value, key) {
				if (vm.occupant(key)) {
					price += ratingPriceByOccupant(key);
				}
			});
			return price * (getNights(vm.product.stay.start_date, vm.product.stay.end_date) || 1);
		}

		function planePriceByOccupant(occupantId) {
			return priceByOccupant('plane_ticket', occupantId)
		}

		function totalPlanePrice() {
			var price = 0;
			angular.forEach(vm.product.plane_ticket.occupants, function (value, key) {
				if (vm.occupant(key)) {
					price += planePriceByOccupant(key);
				}
			});
			return price;
		}

		function insurencePriceByOccupant(occupantId) {
			return priceByOccupant('travel_insurence', occupantId);
		}

		function totalInsurencePrice() {
			var price = 0;
			angular.forEach(vm.product.travel_insurence.occupants, function (value, key) {
				if (vm.occupant(key)) {
					price += insurencePriceByOccupant(key);
				}
			});
			return price * (vm.product.travel_insurence.quantity || 1);
		}

		function roadPriceByOccupant(occupantId) {
			return priceByOccupant('road_transport', occupantId);
		}

		function totalRoadTravelPrice() {
			var price = 0;
			angular.forEach(vm.product.road_transport.occupants, function (value, key) {
				if (vm.occupant(key)) {
					price += roadPriceByOccupant(key);
				}
			});
			return price;
		}

		function shipPriceByOccupant(occupantId) {
			return priceByOccupant('ship_ticket', occupantId);
		}

		function totalShipPrice() {
			var price = 0;
			angular.forEach(vm.product.ship_ticket.occupants, function (value, key) {
				if (vm.occupant(key)) {
					price += shipPriceByOccupant(key);
				}
			});
			return price;
		}

		function hotelVisaPrice() {
			fetch();
			return (vm.product.visa.hotel.unit_price || 0) * (vm.product.occupants.length || 0) * (getNights(vm.product.stay.start_date, vm.product.stay.end_date) || 1);
		}

		function consulatVisaPrice() {
			return (vm.product.visa.consulat.unit_price || 0) * (vm.product.occupants.length || 0);
		}

		function rendezVousPrice() {
			return (vm.product.visa.rendez_vous.unit_price || 0) * (vm.product.occupants.length || 0);
		}

		function totalVisaPrice() {
			fetch();
			var price = 0;
			price += vm.showOtherForm ? hotelVisaPrice() : 0;
			price += vm.showConsulatForm ? consulatVisaPrice() : 0;
			price += vm.showRendezVousForm ? rendezVousPrice() : 0;
			return price;
		}

		function totalPrice() {
			var price = 0;
			if (vm.product) {
				price += (vm.showHotelForm || vm.product.type === 'Réservation d’hôtel') ? totalHotelPrice() || 0 : 0;
				price += (vm.showRatingForm || vm.product.type === 'Location') ? totalRatingPrice() || 0 : 0;
				price += (vm.showPlaneTicketForm || vm.product.type === 'Billet d’avion') ? totalPlanePrice() || 0 : 0;
				price += (vm.showInsurenceForm || vm.product.type === 'Assurance de voyage') ? totalInsurencePrice() || 0 : 0;
				price += (vm.product.type === 'Transport routier') ? totalRoadTravelPrice() || 0 : 0;
				price += (vm.showShipTicketForm || vm.product.type === 'Transport maritime') ? totalShipPrice() || 0 : 0;
				price += (vm.product.type === 'Traitement de dossier de visa') ? totalVisaPrice() || 0 : 0;
				price += (vm.showOtherForm || vm.product.type === 'Autre') ? totalOtherPrice() || 0 : 0;
				if (!vm.product.skipDetail) vm.product.purchase_price_default = price;
				vm.product.total_default = vm.product.purchase_price_default * (1 + ((vm.product.total_profit || 0) / 100));

				vm.product.purchase_price = vm.product.purchase_price_default * vm.product.exchange_rate;
				vm.product.total = vm.product.total_default * vm.product.exchange_rate;
			}
			return price;
		}
	}
})();