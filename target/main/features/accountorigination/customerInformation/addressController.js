(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.address',
        ['refresh.accountOrigination.domain.customer']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/address', {
            templateUrl: 'features/accountorigination/customerInformation/partials/address.html',
            controller: 'ViewAddressController',
            resolve: {
                checkRouting: function ($location, $route, CustomerInformationData) {
                    if (!new AddressValidation().validateSection(CustomerInformationData.current())) {
                        CustomerInformationData.stash();
                        $location.path('/apply/' + $route.current.params.product + '/address/edit').replace();
                    }
                }
            }
        });
    });

    app.controller('ViewAddressController', function ($scope, $location, $routeParams, CustomerInformationData) {
        $scope.product = $routeParams.product;
        $scope.customerInformationData = CustomerInformationData.current();
        $scope.edit = function () {
            CustomerInformationData.stash();
            $location.path('/apply/' + $scope.product + '/address/edit');
        };

        $scope.next = function () {
            $location.path('/apply/' + $scope.product + '/employment');
        };
    });
})();