(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformationNavigation', ['refresh.security.user', 'refresh.accountOrigination.common.directives.cancelConfirmation']);

    app.controller('customerInformationNavigationController', function ($scope, $routeParams, $location, User, CancelConfirmationService) {
        $scope.product = $routeParams.product;

        $scope.canNavigate = function () {
            return User.hasBasicCustomerInformation();
        };

        $scope.navigate = function (section) {
            if (section === $scope.currentPage) {
                return;
            }

            var navigate = function () {
                $location.url('/apply/' + $scope.product + '/' + section);
            };

            if ($scope.editing) {
                CancelConfirmationService.cancelEdit(navigate);
            }
            else {
                navigate();
            }

        };
    });

    app.directive('customerInformationNavigation', function () {
        return {
            restrict: 'E',
            templateUrl: 'features/accountorigination/customerInformation/directive/partials/customerInformationNavigation.html',
            scope: {
                editing: '=',
                currentPage: '=',
                confirmationCheck: '&',
                confirmSave: '&'
            },
            controller: 'customerInformationNavigationController'
        };
    });
})();