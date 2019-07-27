var debitOrderSwitchingFeature = false;
if(feature.debitOrderSwitching){
    debitOrderSwitchingFeature = true;
}

(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        var isValidAccountApplicationState = function(CurrentAccountApplication) {
            return  CurrentAccountApplication.isInProgress();
        };

        var allowedFrom = [''];

        if(debitOrderSwitchingFeature){
            allowedFrom = [{path: '/apply/current-account/accept', condition: isValidAccountApplicationState}];
        }
        $routeProvider.when('/apply/current-account/debit-order-switching', {
            templateUrl: 'features/accountorigination/currentaccount/screens/debitorderswitching/partials/debitOrderSwitching.html',
            controller: 'DebitOrderSwitchingController',
            allowedFrom: allowedFrom,
            safeReturn: '/apply'
        });
    });

    app.controller('DebitOrderSwitchingController', function ($scope, $location, Flow, NotificationService, URL,
                                                              CurrentAccountApplication, DebitOrderSwitchingService) {
        function next() {
            var acceptResponse = CurrentAccountApplication.acceptOfferResponse();
            if (_.isEmpty(acceptResponse.crossSell.offerDetails)) {
                Flow.next();
                $location.path('/apply/current-account/finish').replace();
            } else {
                $location.path('/apply/current-account/accept/card').replace();
            }
        }

        $scope.switchDebitOrder = function () {
            var accountNumber = CurrentAccountApplication.acceptOfferResponse().accountNumber;
            DebitOrderSwitchingService.acceptDebitOrderSwitching(accountNumber).catch(function () {
                //TODO Check if we can log this somewhere. Speak to Prisca about how this should be logged
            }).finally(function () {
                next();
            });
        };

        $scope.doNotSwitchDebitOrder = function () {
            next();
        };

    });
})(angular.module('refresh.accountOrigination.currentAccount.screens.debitOrderSwitching', ['refresh.flow',
    'refresh.configuration',
    'refresh.notifications.service',
    'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
    'refresh.accountOrigination.currentAccount.services.debitOrderSwitchingService']));