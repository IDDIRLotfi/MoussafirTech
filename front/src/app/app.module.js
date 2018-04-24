(function () {
  'use strict';

  angular.module('Moussafir', [
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'ui.sortable',
    'ui.router',
    'ngTouch',
    'toastr',
    'smart-table',
    'ngResource',
    "xeditable",
    'ui.slimscroll',
    'ngJsTree',
    'angular-progress-button-styles',
    'isteven-multi-select', //to be removed
    'ui.multiselect', //being improved
    'dialogs.main',
    'ngMap',
    'pascalprecht.translate',

    'Moussafir.host',
    'Moussafir.key',
    'Moussafir.auth',
    'Moussafir.theme',
    'Moussafir.main'
  ]);
})();