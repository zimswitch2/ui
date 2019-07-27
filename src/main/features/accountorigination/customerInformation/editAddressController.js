(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.edit.address', [
        'refresh.lookups',
        'refresh.accountOrigination.customerService',
        'refresh.accountOrigination.domain.customer',
        'refresh.accountOrigination.common.directives.cancelConfirmation',
        'refresh.accountOrigination.common.services.accountOriginationProvider'
    ]);

    var addressFields = ['unitNumber', 'building', 'suburb', 'streetPOBox', 'cityTown', 'postalCode'];

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/address/edit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editAddress.html',
            controller: 'EditAddressController'
        });
    });

    app.controller('EditAddressController',
        function ($scope, $routeParams, $location, $window, ApplicationParameters, LookUps, CustomerService,
                  CustomerInformationData, CancelConfirmationService, User, AccountOriginationProvider, DtmAnalyticsService) {

            function createAddress(address, isResidentialAddress) {
                if (isResidentialAddress) {
                    return new Address(_.cloneDeep(address), '05');
                }
                return new Address(_.cloneDeep(address), '02');
            }


            function isSameAddress(first_address, second_address) {
                return _.all(addressFields, function (property) {
                    return _.get(first_address, property, null) === _.get(second_address, property, null);
                });
            }

            function isSamePostalAndResidential() {
                if ($scope.residentialAddress === emptyResidentialAddress ||
                    $scope.postalAddress === emptyPostalAddress) {
                    return undefined;
                }

                return isSameAddress($scope.residentialAddress, $scope.postalAddress);
            }

            function setPostalAddress(isSamePostalAndResidential, forSave) {
                var wantToSaveDifferentPostalAddress = !isSamePostalAndResidential && forSave;
                if (wantToSaveDifferentPostalAddress) {
                    return;
                }

                _.each(addressFields, function (property) {
                    $scope.postalAddress[property] =
                        isSamePostalAndResidential ? $scope.residentialAddress[property] : '';
                });
            }

            var emptyResidentialAddress = createAddress({
                addressType: '01',
                validFrom: moment().format('YYYY-MM-DD'),
                addressUsage: [{
                    usageCode: '05',
                    deleteIndicator: false,
                    validFrom: moment().format('YYYY-MM-DD')
                }]
            }, true);

            var emptyPostalAddress = createAddress({
                addressType: '01',
                validFrom: moment().format('YYYY-MM-DD'),
                addressUsage: [{
                    usageCode: '02',
                    deleteIndicator: false,
                    validFrom: moment().format('YYYY-MM-DD')
                }]
            }, false);

            LookUps.residentialStatus.promise().then(function (response) {
                $scope.accommodationTypes = response;
            });

            $scope.product = $routeParams.product;
            $scope.customerInformationData = CustomerInformationData.current();
            $scope.errorMessage = {};
            $scope.cancelButtonText = new AddressValidation().validateSection($scope.customerInformationData) ? 'Cancel' : 'Back';
            if ($scope.customerInformationData.shouldCreate) {
                DtmAnalyticsService.recordFormSubmissionCompletion();
            }

            $scope.residentialAddress = $scope.customerInformationData.getCurrentResidentialAddress() ?
                createAddress($scope.customerInformationData.getCurrentResidentialAddress(), true) :
                emptyResidentialAddress;

            $scope.postalAddress = $scope.customerInformationData.getCurrentPostalAddress() ?
                createAddress($scope.customerInformationData.getCurrentPostalAddress(), false) :
                emptyPostalAddress;

            $scope.isSamePostalAndResidential = isSamePostalAndResidential();

            $scope.setPostalSameAsResidential = function (isSamePostalAndResidential) {
                $scope.isSamePostalAndResidential = isSamePostalAndResidential;
                setPostalAddress(isSamePostalAndResidential, false);
            };

            $scope.checkStreetDetails = function () {
                $scope.errorMessage.streetPOBox = undefined;
                var streetPOBox = $scope.residentialAddress.streetPOBox;

                if (streetPOBox === undefined) {
                    return;
                }
                if (!/\d/.test(streetPOBox)) {
                    $scope.errorMessage.streetPOBox = 'The street number is missing';
                }
                if (!/[a-zA-Z]/.test(streetPOBox)) {
                    $scope.errorMessage.streetPOBox = 'The street name is missing';
                }
            };

            $scope.next = function () {
                CancelConfirmationService.cancelEdit(function () {
                    $location.path('/apply/' + $scope.product + '/employment');
                });
            };

            $scope.save = function () {
                setPostalAddress($scope.isSamePostalAndResidential, true);

                var hasResidentialAddressChanged = !isSameAddress($scope.residentialAddress,
                    $scope.customerInformationData.getCurrentResidentialAddress());
                var hasPostalAddressChanged = !isSameAddress($scope.postalAddress,
                    $scope.customerInformationData.getCurrentPostalAddress());

                if (hasResidentialAddressChanged || hasPostalAddressChanged) {

                    if (hasResidentialAddressChanged) {
                        $scope.residentialAddress.getUsage().validFrom = moment().format('YYYY-MM-DD');
                    }

                    if (hasPostalAddressChanged) {
                        $scope.postalAddress.getUsage().validFrom = moment().format('YYYY-MM-DD');
                    }

                    $scope.customerInformationData.addressDetails = [createAddress($scope.residentialAddress, true),
                        createAddress($scope.postalAddress, false)];
                    var customer = _.cloneDeep($scope.customerInformationData);

                    if (_.isEmpty(customer.getPassport())) {
                        delete customer.permitDetails;
                    }

                    delete customer.shouldCreate;

                    var viewAddressUrl = '/apply/' + $scope.product + '/address';

                    if ($scope.customerInformationData.shouldCreate) {

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
                                else if (response.headers('x-sbg-response-code') === '3') {
                                    $scope.serverErrorMessage = response.headers('x-sbg-response-message');
                                }

                                return;
                            }

                            delete $scope.customerInformationData.shouldCreate;
                            User.setBpIdSystemPrincipalIdentifier(response.data.systemPrincipalIdentifier);
                            $location.path(viewAddressUrl).replace();
                        });

                    } else {
                        CustomerService.updateAddress(customer).then(function (response) {
                            $location.path(viewAddressUrl).replace();
                        }).catch(function (error) {
                            $scope.serverErrorMessage = error.message;
                            if (User.hasDashboards()) {
                                ApplicationParameters.pushVariable('otpErrorMessage', error.message);
                            }
                        });
                    }
                }
            };

            $scope.cancel = function () {
                CancelConfirmationService.cancelEdit(function () {
                    $window.history.go(-1);
                });
            };

            $scope.navigateToLinkCard = function () {
                $location.path('/linkcard');
            };
        });
})();
