(function () {

    'use strict';
    var app = angular.module('refresh.targetedOffers.callMeBackFormController', ['refresh.accountOrigination.customerService', 'refresh.modalMessage']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/targetedoffers/:productName/callmeback', {
                templateUrl: 'features/targetedOffers/partials/targetedOffersCallMeBackForm.html',
                controller: 'TargetedOfferCallMeBackFormController'
            });
    });

    app.controller('TargetedOfferCallMeBackFormController', function ($scope, $location, mapFilter, CustomerService, TargetedOffersService, ModalMessage) {
        $scope.offer = TargetedOffersService.getLastActionedOffer();

        CustomerService.getCustomer().then(function (customer) {
            $scope.customerRecord = customer;
            var contactNumbers = _.pluck(_.sortBy(_.filter(customer.communicationInformation, function(communicationDetail) {
                return _.contains(['01', '02'], communicationDetail.communicationTypeCode) && !communicationDetail.deleteIndicator;
            }), function (communicationDetail) {
                return communicationDetail.communicationTypeCode;
            }).reverse(), 'communicationDetails');
            $scope.customerModel = {
                fullName: mapFilter(customer.customerTitleCode, 'title') + ' ' + customer.customerFirstName + ' ' + customer.customerSurname,
                contact1: contactNumbers.length > 0 ? contactNumbers[0] : null,
                // contact2: contactNumbers.length > 1 ? contactNumbers[1] : null,
                idNumber: _.first(_.pluck(_.filter(customer.identityDocuments, function(identityDocument) {
                              return identityDocument.identityTypeCode === '01' && identityDocument.countryCode === 'ZA';
                          }), 'identityNumber'))
            };
        });

        $scope.back = function(){
            $location.path('/account-summary');
        };

        $scope.submit = function () {
            $scope.customerModel.fullName = mapFilter($scope.customerRecord.customerTitleCode, 'title') + ' ' + $scope.customerRecord.customerFirstName + ' ' + $scope.customerRecord.customerSurname;
            TargetedOffersService.submitDetailsToDCS($scope.offer.dcsProductName, $scope.customerModel).then(function () {
                ModalMessage.showModal({
                    title: "Call me back",
                    message: "Thank you -- your details have been sent. A consultant will call you back within one working day.",
                    whenClosed: function () {
                       $scope.back();
                    }
                });
            });
        };
    });
})();
