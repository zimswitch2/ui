(function (app) {
    'use strict';

    app.directive('beneficiariesList', [function () {
        return {
            controller: "BeneficiariesTableController",
            restrict: 'E',
            scope: {
                onSelect: '&'
            },
            templateUrl: 'features/beneficiaries/partials/beneficiariesList.html'
        };
    }]);

})(angular.module('refresh.beneficiaries.directives.beneficiariesList', []));