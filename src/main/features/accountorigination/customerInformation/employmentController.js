var customerManagementV4Feature = false;

if (feature.customerManagementV4) {
    customerManagementV4Feature = true;
}

(function () {

    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.employment',
        ['refresh.lookups', 'refresh.accountOrigination.customerService', 'refresh.accountOrigination.domain.customer']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/employment', {
            templateUrl: 'features/accountorigination/customerInformation/partials/employment.html',
            controller: 'EmploymentController',
            resolve: {
                checkRouting: function ($location, $route, CustomerInformationData) {
                    if (!new EmploymentValidation().validateSection(CustomerInformationData.current())) {
                        CustomerInformationData.stash();
                        $location.path('/apply/' + $route.current.params.product + '/employment/edit').replace();
                    }
                }
            }
        });
    });

    app.controller('EmploymentController', function ($scope, $location, $routeParams, CustomerInformationData) {

        $scope.customerInformationData = CustomerInformationData.current();
        $scope.product = $routeParams.product;

        $scope.edit = function (action) {
            CustomerInformationData.stash();

            if (action === 'add') {
                $location.path('/apply/' + $routeParams.product + '/employment/add');
            } else {
                $location.path('/apply/' + $routeParams.product + '/employment/edit');
            }
        };

        $scope.gotoIncomePage = function(){
            $location.path('/apply/' + $scope.product + '/income');
        };
    });

})();