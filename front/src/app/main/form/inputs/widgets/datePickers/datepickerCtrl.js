/**
 * Created by n.poltoratsky
 * on 23.06.2016.
 */
(function(){
    'use strict';

    angular.module('main.form')
        .controller('datepickerCtrl', datepickerCtrl);

    /** @ngInject */
    function datepickerCtrl($scope) {

        $scope.dt = new Date();
        $scope.options = {
            showWeeks: false
        };

    }
})();