(function () {
	'use strict';

	angular.module('main.clients')
		.factory('ClientService', ClientService);

	function ClientService($resource, $window) {
		var api_endpoint = $window.localStorage['host'];
		return $resource(api_endpoint + 'clients/:clientId', {
			clientId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		})
	}
})();