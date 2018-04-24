(function () {
	'use strict';

	angular
		.module('Moussafir')
		.config(config);

	function config($locationProvider, toastrConfig, $provide, dialogsProvider, $translateProvider, $translatePartialLoaderProvider) {
		$locationProvider.html5Mode(true);

		angular.extend(toastrConfig, {
			"autoDismiss": true,
			"positionClass": "toast-top-right",
			"type": "info",
			"timeOut": "3000",
			"extendedTimeOut": "0",
			"allowHtml": false,
			"closeButton": true,
			"tapToDismiss": true,
			"progressBar": true,
			"newestOnTop": true,
			"maxOpened": "1",
			"preventOpenDuplicates": true
		});

		$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
			taOptions.forceTextAngularSanitize = false;
			return taOptions;
		}]);

		dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(true);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');



		// angular-translate configuration
		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: '{part}/i18n/{lang}.json'
		});

		$translateProvider.preferredLanguage('fr');

		$translatePartialLoaderProvider.addPart('app');
		$translateProvider.useSanitizeValueStrategy(null);
	}
})();