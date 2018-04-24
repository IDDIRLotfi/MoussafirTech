(function () {
	'use strict';

	angular
		.module('main.products')
		.factory('PrintService', PrintService);

	function PrintService($rootScope, $state, toastr, CalculationService) {
		var vm = this;

		return {
			print: print
		}

		function getClient(clientId) {
			return vm.clients.find(function (client) {
				return client._id === clientId
			});
		}

		function contains(string, product) {
			for (var i = 0; i < product.visa.products.length; i++) {
				if (product.visa.products[i].name === string) {
					return true;
				}
			}
			return false;
		}

		function totalVisaPrice(occupantId, product) {
			var price = 0;
			if (contains('Hébergement', product) && product.visa && product.visa.hotel && product.visa.hotel.accommodation_type && product.visa.hotel.accommodation_type !== 'Autre') {
				price += CalculationService.hotelPriceByOccupant(occupantId);
			};
			if (contains('Assurance de voyage', product)) {
				price += CalculationService.insurencePriceByOccupant(occupantId);
			};
			if (contains('Billet d’avion', product)) {
				price += CalculationService.planePriceByOccupant(occupantId);
			};
			if (contains('Billet de bateau', product)) {
				price += CalculationService.shipPriceByOccupant(occupantId);
			};
			if (contains('Consulat', product)) {
				price += CalculationService.consulatVisaPrice() / product.occupants.length;
			};
			if (contains('Prendre le rendez-vous', product)) {
				price += CalculationService.rendezVousPrice() / product.occupants.length;
			};
			if (contains('Autre', product)) {
				price += CalculationService.totalOtherPrice(occupantId) / product.occupants.length;
			};
			return price;
		}

		function getOccupantTable(product, clients) {
			CalculationService.init(function () {
				return {
					product: product,
					occupant: getClient
				}
			});
			var table = {
				columns: [{
					title: "Nom Complet",
					dataKey: "username"
				}],
				rows: []
			};
			if (product.type !== 'Réservation d’hôtel' && product.type !== 'Autre' && product.type !== 'Traitement de dossier de visa') {
				table.columns.push({
					title: "Age",
					dataKey: "age"
				});
			}
			var occupants = [];
			var totalFunction;
			switch (product.type) {
				case ('Réservation d’hôtel'):
					occupants = product.hotel.occupants;
					table.columns.push({
						title: "Type Chambre",
						dataKey: "room_type"
					}, {
						title: "Type Personne",
						dataKey: "occupant_type"
					}, {
						title: "Supplément",
						dataKey: "supplement_type"
					});
					totalFunction = CalculationService.hotelPriceByOccupant;
					break;
				case ('Location'):
					occupants = product.ranting.occupants;
					totalFunction = CalculationService.ratingPriceByOccupant;
					break;
				case ('Billet d’avion'):
					occupants = product.plane_ticket.occupants;
					totalFunction = CalculationService.planePriceByOccupant;
					break;
				case ('Assurance de voyage'):
					occupants = product.travel_insurenceoccupants;
					totalFunction = CalculationService.insurencePriceByOccupant;
					break;
				case ('Transport routier'):
					occupants = product.road_transport.occupants;
					totalFunction = CalculationService.roadPriceByOccupant;
					table.columns.push({
						title: "Lieu Départ",
						dataKey: "departure_place"
					});
					break;
				case ('Transport maritime'):
					occupants = product.ship_ticket.occupants;
					totalFunction = CalculationService.shipPriceByOccupant;
					break;
				case ('Traitement de dossier de visa'):
					occupants = product.occupants;
					totalFunction = totalVisaPrice; //?
					break;
				case ('Autre'):
					occupants = product.occupants;
					totalFunction = CalculationService.totalOtherPrice;
					break;
			}
			table.columns.push({
				title: "Sous Total",
				dataKey: "total"
			});
			angular.forEach(occupants, function (occupantDétail, id) {
				var occupant = getClient(angular.isArray(occupants) ? occupantDétail : id);
				if (occupant) {
					table.rows.push(Object.assign({
						username: (occupant.username || ((occupant.first_name || '') + " " + (occupant.last_name || ''))),
						total: (product.type === 'Autre') ? (totalFunction(id) / product.occupants.length) : totalFunction(id, product)
					}, occupantDétail));
				}
			});
			return table;
		}

		function print(agency_logo, agency_info, product, clients) {
			vm.clients = clients;
			try {
				var doc = new jsPDF();

				// Agency logo
				if (agency_logo) doc.addImage(agency_logo, 'JPEG', 5, 5, 35, 35);

				// Header Text
				doc.setFontSize(11)
				doc.text(45, 10, 'Agence de voyage : ' + (agency_info.name || ''));
				doc.text(200, 10, 'Agent : ' + $rootScope.current_user.email, null, null, 'right');


				doc.text(45, 15, 'Tel : ' + (agency_info.phone || ''));
				doc.text(45, 20, 'Fax : ' + (agency_info.fax || ''));
				doc.text(45, 25, 'Email : ' + (agency_info.email || ''));
				doc.text(45, 30, 'Site Web : ' + (agency_info.web_site || ''));
				doc.text(45, 35, 'Autre: ' + (agency_info.other || ''));

				// Document Title
				doc.setFontSize(25)
				doc.setFontType("bold");
				doc.text(105, 50, 'Reçu de Payment N° ', null, null, 'center');

				// Product Price
				doc.setFontSize(13);
				doc.setFontType("normal");
				doc.line(0, 58, 210, 58);
				doc.text(5, 65, 'Reçu la somme de : ' + (product.paid_amount || 0));
				doc.text(105, 65, 'Total : ' + (product.total || 0), null, null, 'center');
				doc.text(200, 65, 'Reste : ' + (((product.total || 0) - (product.paid_amount || 0))), null, null, 'right');
				doc.line(0, 68, 210, 68);

				// Product Information
				doc.text(5, 80, 'Nom de produit : ' + (product.name || product.type));
				doc.text(200, 80, 'Date d\'ajout : ' + product.date.slice(0, 10), null, null, 'right');
				doc.text(5, 87, 'A partir de : ' + product.stay.start_date.slice(0, 10));
				doc.text(200, 87, 'Jusqu\'au : ' + product.stay.end_date.slice(0, 10), null, null, 'right');
				doc.text(5, 94, 'Destination : ' + product.destination.country + ', ' + product.destination.province + ', ' + product.destination.city);

				// Client name
				doc.setFontType("bold");
				doc.text(5, 110, 'Client : ');
				doc.text(200, 110, 'Numéro de téléphone: ' + (product.client.phone_numbers ? product.client.phone_numbers[0] : ''), null, null, 'right');
				doc.setFontType("normal");
				doc.text(25, 110, product.client.username);


				// Occupants names
				doc.setFontType("bold");
				doc.text(5, 120, 'Nom des occupants : ');
				doc.setFontType("normal");
				doc.line(8, 125, 200, 125);

				var occupant_number = 1;
				angular.forEach(product.occupants, function (occupant) {
					if (occupant_number % 2 !== 0) {
						doc.text(15, 125 + ((parseInt(occupant_number / 2) + 1) * 10), occupant_number + '/ ' + getClient(occupant).username);
					} else {
						doc.text(190, 125 + (parseInt(occupant_number / 2) * 10), occupant_number + '/ ' + getClient(occupant).username, null, null, 'right');
					}
					occupant_number++;
				});


				var occupant_margin = 125 + (parseInt(occupant_number / 2) * 10);
				doc.line(8, (occupant_margin + 5), 8, 125);
				doc.line(200, (occupant_margin + 5), 200, 125);
				doc.line(8, (occupant_margin + 5), 200, (occupant_margin + 5));


				// Occupants Details Table Header
				doc.setFontSize(20)
				doc.setFontType("bold");
				doc.text(105, occupant_margin + 15, 'Détail d\'achat N° ', null, null, 'center');
				doc.setFontSize(13)
				doc.setFontType("normal");
				doc.text(105, occupant_margin + 23, 'Liste des Personnes', null, null, 'center');



				// first page Footer
				doc.setFontSize(14);
				doc.text(20, 265, 'Signature');

				doc.setFontSize(12);
				doc.text(5, 285, 'Condition de réservation:');
				doc.text(5, 290, 'En cas d\'annulation ou de noshow, l\'hôtel peut facturer jusqu\'au montan total de la réservation');

				var table = getOccupantTable(product, clients);

				// Occupants Details Table Content
				var columns = table.columns;
				var rows = table.rows;

				doc.autoTable(columns, rows, {
					styles: {
						fillColor: false,
						textColor: 0,
						lineColor: 0
					},
					headerStyles: {
						textColor: 0,
						lineColor: 0
					},
					tableWidth: 200,
					theme: 'grid',
					margin: {
						top: occupant_margin + 30,
						left: 5
					}
				});

				// doc.autoPrint()
				doc.save('a4.pdf');
			} catch (err) {
				console.log(err);
				// if any field is missing go to product form
				$state.go('edit_product', {
					id: product._id
				});
				toastr.warning('Veuiller Remplir les informations restantes!', 'Attention');
			}
		}
	}
})();