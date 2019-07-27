var rcpEnabled = false;

if (feature.rcp) {
    rcpEnabled = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.currentAccount.screens.products', ['ngRoute', 'refresh.accordion',
        'refresh.accountOrigination.currentAccount.domain.currentAccountProductContent', 'refresh.accountOrigination.common.services.applicationLoader',
        'refresh.accountOrigination.currentAccount.services.currentAccountOffersService',
        'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
        'refresh.accountOrigination.domain.customer',
        'refresh.accountOrigination.customerService']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/current-account', {
            templateUrl: 'features/accountorigination/currentaccount/screens/products/partials/currentAccountProducts.html',
            controller: rcpEnabled ? 'CurrentAccountProductController' : 'OldCurrentAccountProductController'
        });
    });

    app.controller('OldCurrentAccountProductController', function ($scope, $q, $location,
                                                                   ApplicationLoader, CurrentAccountProductFamilyContent,
                                                                   CurrentAccountOffersService,
                                                                   CurrentAccountApplication, NotificationService, Flow,
                                                                   User, CustomerService, CustomerInformationData) {
        $scope.application = {};

        $scope.products = CurrentAccountProductFamilyContent.all();

        $scope.pageTitle = 'Current account solutions';

        $scope.newToBankCustomer = !User.hasDashboards();

        if (User.hasBasicCustomerInformation()) {
            CustomerService.getCustomer().then(function (data) {
                var customer = CustomerInformationData.initialize(data);
                $scope.kycCompliant = customer.isKycCompliant();
            });
        }


        var modifyProductName = function (name) {
            var replace = name.toUpperCase() === 'PRIVATE BANKING PLUS CURRENT ACCOUNT' ? ' PLUS CURRENT ACCOUNT' :
                ' CURRENT ACCOUNT';
            return name.toUpperCase().replace(replace, '');
        };

        ApplicationLoader.loadAll().then(function (application) {
            $scope.application = application.current;
            if ($scope.hasAcceptedOffer()) {
                $scope.pageTitle = "Application in progress";
                $scope.application.productName = modifyProductName($scope.application.productName);
                $scope.isPrivateBankingProduct = $scope.application.productName.toUpperCase() === "PRIVATE BANKING";
            } else if ($scope.hasPendingOffer()) {
                $scope.pageTitle = "Pending offer";
            }
        });

        if (User.hasBasicCustomerInformation()) {
            CustomerService.getCustomer().then(function (data) {
                var customer = CustomerInformationData.initialize(data);
                $scope.kycCompliant = customer.isKycCompliant();
            });
        }

        $scope.hasPendingOffer = function () {
            return $scope.application.status === 'PENDING';
        };

        $scope.hasAcceptedOffer = function () {
            return $scope.application.status === 'ACCEPTED';
        };

        $scope.hasCurrentAccount = function () {
            return $scope.application.status === 'EXISTING';
        };

        $scope.canApply = function () {
            return $scope.application.status === 'NEW';
        };

        $scope.hasOverdraft = function () {
            return $scope.application && $scope.application.limitAmount > 0;
        };

        $scope.viewOffer = function () {
            CurrentAccountOffersService.getQuotationDetails($scope.application.reference).then(function (offer) {
                CurrentAccountApplication.continue({
                    applicationNumber: $scope.application.reference,
                    offer: offer
                });
                Flow.create(['Details', 'Offer', 'Confirm', 'Finish']);
                Flow.next();
                $location.url('/apply/current-account/pre-screen').replace();
            });
        };

    });


    app.controller('CurrentAccountProductController', function ($scope, $location, ApplicationLoader,
                                                                CurrentAccountProductFamilyContent) {
        var applicationStatus;

        $scope.products = CurrentAccountProductFamilyContent.all();

        ApplicationLoader.loadAll().then(function (application) {
            applicationStatus = application.current.status;

            if (applicationStatus !== 'EXISTING' && applicationStatus !== 'NEW') {
                $location.path('/apply');
            }
        });

        $scope.hasCurrentAccount = function () {
            return applicationStatus === 'EXISTING';
        };

        $scope.canApply = function () {
            return applicationStatus === 'NEW';
        };

    });


})();
