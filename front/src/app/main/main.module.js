(function () {
  'use strict';

  angular
    .module('Moussafir.main', [
      'main.home',
      'main.form',
      'main.clients',
      'main.suppliers',
      'main.products',
      'main.trips',
      'main.balance',
      'main.users'
    ])
    .config(routeConfig); 

  /** @ngInject */
  function routeConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        templateUrl: 'app/main/main.html',
        controller: "MainController",
        controllerAs: "vm"
      });
  }
})();