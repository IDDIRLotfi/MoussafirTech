(function () {
	'use strict';

	angular
		.module('main.balance', [])
		.config(config);

	function config($stateProvider) {
		$stateProvider
			.state('balance', {
				parent: 'main',
				url: '/balance',
				templateUrl: 'app/main/balance/balance.html',
				title: 'Balance Total',
				translate: "home.total_balance",
				controller: "BalanceController",
				controllerAs: "balVm",
				sidebarMeta: {
					icon: 'ion-cash',
					hideArrow: true,
					order: 2,
					roles: ['admin', 'super-admin']
				},
				loginRequired: true,
				adminRequired: true
			});
	}
})();