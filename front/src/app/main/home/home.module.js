(function () {
  'use strict';

  angular.module('main.home', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard', {
        parent: "main",
        url: '/',
        templateUrl: 'app/main/home/home.html',
        title: 'Acceuil',
        translate: "home.main",
        controller: "HomeController",
        controllerAs: "homeVm",
        sidebarMeta: {
          icon: 'ion-android-home',
          hideArrow: true,
          order: 0,
        },
        loginRequired: true
      });
  }

})();