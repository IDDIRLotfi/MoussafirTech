/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('main.form', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('form', {
          url: '/form',
          template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Form Elements'
        })
        .state('form.inputs', {
          url: '/inputs',
          templateUrl: 'app/main/form/inputs/inputs.html',
          title: 'Form Inputs',
          sidebarMeta: {
            order: 0,
          },
        })
        .state('form.layouts', {
          url: '/layouts',
          templateUrl: 'app/main/form/layouts/layouts.html',
          title: 'Form Layouts',
          sidebarMeta: {
            order: 100,
          },
        })
        .state('form.wizard',
        {
          url: '/wizard',
          templateUrl: 'app/main/form/wizard/wizard.html',
          controller: 'WizardCtrl',
          controllerAs: 'vm',
          title: 'Form Wizard',
          sidebarMeta: {
            order: 200,
          },
        });
  }
})();
