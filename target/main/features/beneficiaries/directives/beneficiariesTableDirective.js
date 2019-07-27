(function (app) {
    'use strict';

    app.directive('beneficiariesTable', [function () {
        return {
            controller: "BeneficiariesTableController",
            restrict: 'E',
            scope: {
                onSelect: '&',
                actionable: '@'
            },
            templateUrl: 'features/beneficiaries/partials/beneficiariesTable.html'
        };
    }]);

})(angular.module('refresh.beneficiaries.directives.beneficiariesTable', []));