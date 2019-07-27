(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.consent',
        [
            'refresh.accountOrigination.domain.customer',
            'refresh.flow',
            'refresh.notifications.service',
            'refresh.accountOrigination.customerInfoValidation',
            'refresh.accountOrigination.common.directives.cancelConfirmation',
            'refresh.accountOrigination.common.services.accountOriginationProvider'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/submit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/consent.html',
            controller: 'ConsentController',
            resolve: {
                checkRouting: function ($location, $route, CustomerInformationData) {
                    if (!CustomerInformationData.current().hasMarketingConsent()) {
                        CustomerInformationData.stash();
                        $location.path('/apply/' + $route.current.params.product + '/submit/edit').replace();
                    }
                }
            }
        });
    });

    app.controller('ConsentController', function ($scope, $location, $routeParams, CustomerInformationData,
                                                  Flow, NotificationService,
                                                  CustomerInfoValidation, AccountOriginationProvider) {

        var modalState = {};

        $scope.product = $routeParams.product;
        var provider = AccountOriginationProvider.for($scope.product);

        $scope.customerInformationData = CustomerInformationData.current();
        $scope.getOfferButtonText = provider.buttonText.offer;

        var navigateToEdit = function (route) {
            return function () {
                CustomerInformationData.stash();
                $location.path('/apply/' + $scope.product + '/' + route + '/edit');
            };
        };

        var handleServiceError = function (response) {
            NotificationService.displayGenericServiceError(response);
        };

        var goToOffers = function () {
            provider.service.getOffers().then(function (offer) {

                provider.application.offer(offer);
                Flow.next();
                $location.path(provider.paths.offer).replace();

            }).catch(function (rejection) {
                if (!rejection.reason) {
                    handleServiceError(rejection);
                }
                else if (rejection.reason === 'DECLINED') {
                    provider.application.decline({offer: rejection});
                    $location.path('/apply/' + $scope.product + '/declined').replace();
                }
                else {
                    $location.path('/apply/' + $scope.product + '/unsupported').replace();
                }
            });
        };

        var isValidCustomer = function () {
            $scope.invalidSections = CustomerInfoValidation.getInvalidSections($scope.customerInformationData);

            if (_.isEmpty($scope.invalidSections)) {
                return true;
            }

            modalState.navigateToFirstInvalidSection = navigateToEdit($scope.invalidSections[0].route);
            $scope.toggleValidationModal(true);

            return false;
        };

        $scope.toggleValidationModal = function (toggle) {
            $scope.showValidationModal = toggle;
        };

        $scope.edit = function () {
            navigateToEdit('submit')();
        };

        $scope.validationModalYes = function () {
            $scope.toggleValidationModal(false);
            modalState.navigateToFirstInvalidSection();
        };

        $scope.submit = function () {
            if (isValidCustomer()) {
                goToOffers();
            }
        };
    });
})();