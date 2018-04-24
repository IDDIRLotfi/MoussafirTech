(function () {
	'use strict';

	angular
		.module('Moussafir.main')
		.factory('ErrorToast', ErrorToast);

	function ErrorToast(toastr, $state, $window, $auth) {
		return function (response) {
			var error = response.data;
			switch (error.code) {
				case (400):
					toastr.warning("Vous devez Remplir tous les champs", 'Erreur');
					break;
				case (401):
					if (error.message === "jwt expired" || error.message === "No auth token") {
						toastr.warning("logout", 'Erreur');
						//TODO improve it
						$window.localStorage.removeItem('current_user');
						$window.localStorage.removeItem('token');
						$auth.logout();
						$state.go('auth');
					} else if (error.message === "Invalid login")
						toastr.error("Nom d'utilisateur ou mot de passe incorrecte", 'Erreur');
					break;
				case (403):
					toastr.error("Vous n'avez pas le droit d'effectuer cette opération.", 'Erreur');
					break;
				case (404):
					toastr.warning("Le contenu que vous avez demandé n'existe pas", 'Erreur');
					break;
				default:
					toastr.error('Service inaccessible pour le moment, Veuiller contacter les developpeurs!', 'Erreur');
					break;
			}
		}
	}
})();