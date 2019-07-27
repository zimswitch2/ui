(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.edit.contact',
        ['refresh.lookups', 'refresh.accountOrigination.customerService', 'refresh.accountOrigination.domain.customer',
            'refresh.accountOrigination.common.directives.cancelConfirmation']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/contact/edit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editContactInformation.html',
            controller: 'EditContactController'
        });
    });

    app.controller('EditContactController', function ($document, $scope, $timeout, $window, $routeParams, $location, LookUps, CustomerService,
                                                      CustomerInformationData, CancelConfirmationService, User, ApplicationParameters) {

        LookUps.contactType.promise().then(function (response) {
            $scope.contactTypes = response;
        });

        $scope.product = $routeParams.product;
        $scope.customerInformationData = CustomerInformationData.current();
        $scope.languages = LookUps.language.values();
        $scope.isNewToBankCustomer = !User.hasDashboards();

        $scope.addContact = function () {
            $scope.customerInformationData.communicationInformation.push(
                {
                    communicationDetails: '',
                    communicationTypeCode: $scope.contactTypes[0].code
                }
            );
        };

        $scope.removeContact = function (index) {
            $scope.customerInformationData.communicationInformation.splice(index, 1);
        };

        $scope.contactsValid = function () {
            var validContacts = true;
            var allContactInputElements = $document.find('.editContact input');
            _.each(allContactInputElements, function (element, index) {
                var contactInputElement = $document.find('input[name="Contact_detail_' + index + '"]');
                var ngModelController = contactInputElement['inheritedData']('$ngModelController');
                if (ngModelController && ngModelController.$invalid) {
                    validContacts = false;
                }
            });

            return validContacts;
        };

        $scope.getInvalidPatternMessage = function (code) {
            if (code === '04') {
                return 'Please enter a valid email address';
            }
            var description = _.result(_.find($scope.contactTypes, {'code': code}), 'description', '').toLowerCase();
            return 'Please enter a valid ' + description + ' number';
        };

        $scope.next = function () {
            CancelConfirmationService.cancelEdit(function () {
                $location.path('/apply/' + $scope.product + '/address');
            });
        };

        $scope.save = function () {
            var customer = _.cloneDeep($scope.customerInformationData);

            CustomerService.updateContactInfo(customer).then(function () {
                $location.url('/apply/' + $scope.product + '/profile').replace();
            })
            .catch(function (error) {
                $scope.serverErrorMessage = error.message;
                if (User.hasDashboards()) {
                    ApplicationParameters.pushVariable('otpErrorMessage', error.message);
                }
            });
        };

        $scope.cancel = function () {
            CancelConfirmationService.cancelEdit(function () {
                $window.history.go(-1);
            });
        };
    });
})();
