(function (app) {
    'use strict';

    app.directive('multipleBeneficiaries', [function () {
    return {
        restrict: 'E',
        scope: '=',
        link: function (scope, element, attrs) {
            scope.filterable = attrs['filterable'];
        },
        templateUrl: 'features/beneficiaries/partials/multipleBeneficiaries.html'
    };
}]);

})(angular.module('refresh.beneficiaries.directives.multipleBeneficiaries', ['refresh.sbForm']));