(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.savings.services.savingsApplicationStartService', [
        'refresh.flow',
        'refresh.accountOrigination.customerService',
        'refresh.accountOrigination.domain.customer',
        'refresh.accountOrigination.savings.domain.savingsAccountApplication',
        'refresh.accountOrigination.savings.services.savingsAccountOffersService',
        'refresh.accountOrigination.domain.customerInformationLoader'
    ]);

    app.factory('SavingsApplicationStartService', function ($location, Flow, NotificationService, CustomerInformationLoader, CustomerService,
                                        CustomerInformationData,  SavingsAccountOffersService,
                                        SavingsAccountApplication) {

        return {
            start: function (productName) {
                CustomerInformationLoader.load().then(function () {
                    CustomerService.updateFraudConsentAndSourceOfFunds(CustomerInformationData.current()).then(function () {

                        CustomerInformationData.current().makeAddressesReadonly();
                        CustomerInformationData.current().makeContactInformationReadonly();

                        if (CustomerInformationData.current().needAdditionalBasicInfo()) {
                            $location.path('/apply/' + productName + '/profile/edit');
                        }
                        else if (!new EmploymentValidation().validateSection(CustomerInformationData.current()) ||
                            !CustomerInformationData.current().hasAnyIncome()) {
                            $location.path('/apply/' + productName + '/profile');
                        }
                        else {
                            SavingsAccountOffersService.getOffers().then(function (offer) {
                                SavingsAccountApplication.offer(offer);
                                Flow.next();
                                $location.path('/apply/' + productName + '/transfer');

                            }).catch(function (rejection) {
                                if (!rejection.reason) {
                                    NotificationService.displayGenericServiceError(rejection);
                                }
                                else {
                                    $location.path('/apply/' + productName + '/declined');
                                }
                            });

                        }
                    });
                });
            }
        };
    });
})();