(function () {
	'use strict';

	angular
		.module("main.clients", ['ui.select', 'ngSanitize'])
		.config(config);

	function config($stateProvider) {
		$stateProvider
			.state('clients', {
				parent: 'main',
				abstract: true,
				title: 'Clients',
				translate: "clients.main",
				sidebarMeta: {
					icon: 'ion-person',
					order: 45,
				},
				loginRequired: true
			}).state('clients_list', {
				parent: 'main',
				url: '/clients/list',
				templateUrl: 'app/main/clients/list/clients.html',
				title: 'Liste des Clients',
				translate: "clients.list",
				controller: "ClientsController as vmCls",
				sidebarMeta: {
					order: 50
				},
				loginRequired: true
			})
			.state('add_client', {
				parent: 'main',
				url: '/clients/add',
				templateUrl: 'app/main/clients/client/client.html',
				title: 'Ajouter Client',
				translate: "clients.add",
				controller: "ClientController",
				controllerAs: "vmCl",
				sidebarMeta: {
					order: 55
				},
				loginRequired: true
			})
			.state('edit_client', {
				parent: 'main',
				url: '/clients/edit/:id', 
				templateUrl: 'app/main/clients/client/client.html',
				title: 'Modifier Client',
				translate: "clients.edit",
				controller: "ClientController",
				controllerAs: "vmCl",
				loginRequired: true
			});
	}
})();