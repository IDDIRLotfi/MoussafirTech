(function () {
	'use strict';

	angular
		.module('main.products')
		.factory('ProductService', ProductService);

	function ProductService($resource, $window) {
		var api_endpoint = $window.localStorage['host'];
		return $resource(api_endpoint + "products/:productId", {
			productId: '@id'
		}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();