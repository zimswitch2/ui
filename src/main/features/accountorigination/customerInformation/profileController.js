var customerManagementV4Feature = false;
if (feature.customerManagementV4) {
    customerManagementV4Feature = true;
}

var newCaptureCustomerInformationFeature = false;
if (feature.newCaptureCustomerInformation) {
    newCaptureCustomerInformationFeature = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.profile', [
        'refresh.lookups',
        'refresh.notifications.service',
        'refresh.accountOrigination.domain.customer',
        'refresh.accountOrigination.customerService',
        'refresh.accountOrigination.rcp.domain.rcpApplication',
        'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
        'refresh.accountOrigination.common.directives.cancelConfirmation',
        'refresh.accountOrigination.common.services.accountOriginationProvider',
        'refresh.accountOrigination.customerInformationErrors'
    ]);

    app.config(function ($routeProvider) {
        var isValidForCustomerInformation = function () {
            return true;
        };

        $routeProvider.when('/apply/:product/profile', {
            templateUrl: newCaptureCustomerInformationFeature ? 'features/accountorigination/customerInformation/partials/newProfile.html'
                : 'features/accountorigination/customerInformation/partials/profile.html',
            controller: newCaptureCustomerInformationFeature ? 'CustomerInformationController' : 'ProfileController',
            resolve: {
                checkRouting: function ($location, $route, CustomerInformationData) {
                    if (!new BasicInfoValidation().validateSection(CustomerInformationData.current())) {
                        CustomerInformationData.stash();
                        if (!newCaptureCustomerInformationFeature) {
                            $location.path('/apply/' + $route.current.params.product + '/profile/edit').replace();
                        }
                    }

                }
            },
            allowedFrom: [
                {path: '/apply', condition: isValidForCustomerInformation},
                {path: '/apply/savings-and-investments', condition: isValidForCustomerInformation},
                {path: '/apply/pure-save', condition: isValidForCustomerInformation},
                {path: '/apply/market-link', condition: isValidForCustomerInformation},
                {path: '/apply/tax-free-call-account', condition: isValidForCustomerInformation},
                {path: '/apply/rcp/pre-screen', condition: isValidForCustomerInformation},
                {path: '/apply/current-account/pre-screen', condition: isValidForCustomerInformation},
                {path: '/otp/verify', condition: isValidForCustomerInformation},
                {path: '/apply/:product/profile/new', condition: isValidForCustomerInformation},
                {path: '/apply/:product/profile/edit', condition: isValidForCustomerInformation},
                {path: '/apply/:product/contact/edit', condition: isValidForCustomerInformation},
                {path: '/apply/:product/address', condition: isValidForCustomerInformation},
                {path: '/apply/:product/address/edit', condition: isValidForCustomerInformation},
                {path: '/apply/:product/employment', condition: isValidForCustomerInformation},
                {path: '/apply/:product/employment/edit', condition: isValidForCustomerInformation},
                {path: '/apply/:product/employment/add', condition: isValidForCustomerInformation},
                {path: '/apply/:product/income', condition: isValidForCustomerInformation},
                {path: '/apply/:product/income/edit', condition: isValidForCustomerInformation},
                {path: '/apply/:product/submit', condition: isValidForCustomerInformation},
                {path: '/apply/:product/submit/edit', condition: isValidForCustomerInformation},
                {path: '/secure-message', condition: isValidForCustomerInformation}
            ],
            safeReturn: '/apply'
        });
    });

    app.controller('ProfileController', function ($scope, $location, $routeParams, CustomerInformationData) {

        $scope.product = $routeParams.product;
        $scope.customerInformationData = CustomerInformationData.current();

        $scope.edit = function (section) {
            CustomerInformationData.stash();
            $location.path('/apply/' + $scope.product + '/' + section + '/edit');
        };

        $scope.next = function () {
            $location.path('/apply/' + $scope.product + '/address');
        };
    });

    app.controller('CustomerInformationController', function ($scope, $location, $routeParams, $window, CustomerInformationData, CancelConfirmationService,
                                                              AccountOriginationProvider, CustomerInformationErrors, CustomerService, User) {
        $scope.product = $routeParams.product;
        $scope.hasBasicInformation = User.hasBasicCustomerInformation();

        $scope.save = function () {
            $scope.customerInformationData = CustomerInformationData.current();
            $scope.customerInformationData.addressDetails = [createAddress($scope.residentialAddress, true),
                createAddress($scope.postalAddress, false)];
            var customer = _.cloneDeep($scope.customerInformationData);

            if (_.isEmpty(customer.getPassport())) {
                delete customer.permitDetails;
            }

            delete customer.shouldCreate;

            var createCustomerRequest = {
                customerInformation: customer
            };

            CustomerService.createCustomer(createCustomerRequest).then(function (response) {
                if (response.headers('x-sbg-response-type') !== 'SUCCESS') {
                    if (response.headers('x-sbg-response-code') === '4444') {
                        $scope.showExistingCustomerModal = true;
                    }
                    else if (response.headers('x-sbg-response-code') === '4445') {
                        var application = AccountOriginationProvider.for($routeParams.product).application;
                        application.decline({offer: {message: "You already have a Revolving Credit Plan (RCP). If you want to increase your RCP limit, please visit your nearest branch. Don't forget that you can borrow again up to your original loan amount as soon as you repay 15% of your loan."}});
                        $location.path('/apply/' + $scope.product + '/declined').replace();
                    }

                    return;
                }

                delete $scope.customerInformationData.shouldCreate;
                User.setBpIdSystemPrincipalIdentifier(response.data.systemPrincipalIdentifier);
                /*Remember to change to direct it to a specific product */
                $location.path('/apply/rcp/unsupported').replace();
            });
        };

        $scope.cancel = function () {
            CancelConfirmationService.cancelEdit(function () {
                $window.history.go(-1);
            });
        };

        $scope.allDatesValid = function () {
            return CustomerInformationErrors.allDatesValid();
        };

        /* The following is temporary code to create fake address copied from the editAddressController */
        function createAddress(address, isResidentialAddress) {
            if (isResidentialAddress) {
                return new Address(_.cloneDeep(address), '05');
            }
            return new Address(_.cloneDeep(address), '02');
        }

        $scope.residentialAddress = createAddress({
            addressType: '01',
            validFrom: '2016-04-18',// moment().format('YYYY-MM-DD'),
            addressUsage: [{
                usageCode: '05',
                deleteIndicator: false,
                validFrom: '2016-04-18' //moment().format('YYYY-MM-DD')
            }]
        }, true);

        $scope.postalAddress = createAddress({
            addressType: '01',
            validFrom: '2016-04-18',//moment().format('YYYY-MM-DD'),
            addressUsage: [{
                usageCode: '02',
                deleteIndicator: false,
                validFrom: '2016-04-18'// moment().format('YYYY-MM-DD')
            }]
        }, false);
    });
})();