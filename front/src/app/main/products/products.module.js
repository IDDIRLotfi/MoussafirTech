(function () {
	'use strict';

	angular
		.module("main.products", ['ngFileUpload'])
		.config(config);

	function config($stateProvider) {
		$stateProvider
			.state('products', {
				parent: 'main',
				abstract: true,
				title: 'Transactions',
				translate: "products.main",
				sidebarMeta: {
					icon: 'ion-clipboard',
					order: 15,
				},
				loginRequired: true
			})
			.state('products_list', {
				parent: 'main',
				url: '/products/list',
				templateUrl: 'app/main/products/list/products.html',
				title: 'Liste des produits',
				translate: "products.list",
				controller: "ProductsController",
				controllerAs: "vmPros",
				sidebarMeta: {
					order: 20
				},
				loginRequired: true
			})
			.state('add_product', {
				parent: 'main',
				url: '/products/add',
				templateUrl: 'app/main/products/product/product.html',
				title: 'Ajouter Produit',
				translate: "products.add",
				controller: "ProductController",
				controllerAs: "vmPro",
				sidebarMeta: {
					order: 25
				},
				loginRequired: true
			})
			.state('edit_product', {
				parent: 'main',
				url: '/products/edit/:id',
				templateUrl: 'app/main/products/product/product.html',
				title: 'Modifier Produit',
				translate: "products.edit",
				controller: "ProductController",
				controllerAs: "vmPro",
				loginRequired: true
			})
			.state('products_dashboard', {
				parent: 'main',
				url: '/products/balance',
				templateUrl: 'app/main/products/dashboard/dashboard.html',
				title: 'Balance',
				translate: "balance.main",
				controller: "DashboardController",
				controllerAs: "vmDs",
				sidebarMeta: {
					order: 16,
					roles: ['admin', 'super-admin']
				},
				loginRequired: true,
				adminRequired: true
			})
			.state('products_with_rest', {
				parent: 'main',
				url: '/products/with-rest',
				templateUrl: 'app/main/products/with-rest/with-rest.html',
				title: 'Produits Avec Reste',
				translate: "products.rest",
				controller: "ProductWithRestController",
				controllerAs: "vmPwr",
				sidebarMeta: {
					order: 17
				},
				loginRequired: true
			});
	}
})();