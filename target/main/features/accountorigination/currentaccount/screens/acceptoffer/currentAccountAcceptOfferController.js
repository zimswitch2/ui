var generateCostOfCreditFeature = false;

{
    generateCostOfCreditFeature = true;
}
var debitOrderSwitchingFeature = false;
{
    debitOrderSwitchingFeature = true;
}
(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        var isValidApplicationState = function(CurrentAccountApplication) {
            return  CurrentAccountApplication.isInProgress();
        };
        $routeProvider.when('/apply/current-account/accept', {
            templateUrl: 'features/accountorigination/currentaccount/screens/acceptoffer/partials/acceptOffer.html',
            controller: 'AcceptOfferController',
            allowedFrom: [{path: '/apply/current-account/offer', condition: isValidApplicationState}],
            safeReturn: '/apply'
        });
    });

    app.controller('AcceptOfferController', function ($scope, $location, Flow, CurrentAccountOffersService, NotificationService, User, URL, CurrentAccountApplication) {
        var offer = CurrentAccountApplication.offer();
        var selection = CurrentAccountApplication.selection();

        $scope.costOfCreditLetterURL = URL.accountOriginationCostOfCreditLetter;
        $scope.offer = offer;
        $scope.product = selection.product;
        $scope.isPrivateBankingProduct = offer.productFamily.name.toUpperCase() === 'PRIVATE BANKING';
        $scope.overdraft = offer.overdraft;
        if (!$scope.isPrivateBankingProduct) {
            $scope.preferredBranchName = selection.branch.name;
        }

        $scope.principal = User.principal().systemPrincipalIdentifier;

        $scope.back = function () {
            Flow.previous();
            $location.path('/apply/current-account/offer').replace();
        };

        $scope.overdraftSelected = function () {
            return $scope.overdraft && $scope.overdraft.selected;
        };

        $scope.downloadAgreement = function () {
            $scope.hasDownloadedAgreement = true;
        };

        $scope.canSubmit = function() {
            return $scope.agreed && !$scope.error && (generateCostOfCreditFeature || !$scope.overdraftSelected() || $scope.hasDownloadedAgreement);
        };

        $scope.submit = function () {
            var overdraft = $scope.overdraft && $scope.overdraft.selected ? $scope.overdraft.amount : undefined;
            var statementsConsent = $scope.overdraft.statementsConsent;
            var consentDetails = {statementsConsentSelected: statementsConsent.selected};
            if (consentDetails.statementsConsentSelected) {
                consentDetails.statementsConsentBranchCode = statementsConsent.branch.code;
                consentDetails.statementsConsentAccountNumber = statementsConsent.accountNumber;
                consentDetails.statementsConsentAccountType = statementsConsent.accountType.name;
            }

            CurrentAccountOffersService.accept(offer.applicationNumber, $scope.product.number, parseInt(selection.branch.code), overdraft, consentDetails)
                .then(function (response) {
                    CurrentAccountApplication.acceptOfferResponse(response);
                    if (debitOrderSwitchingFeature) {
                        $location.path('/apply/current-account/debit-order-switching').replace();
                    } else {
                        if (!_.isEmpty(response.crossSell.offerDetails)) {
                            $location.path('/apply/current-account/accept/card').replace();
                        }
                        else {
                            Flow.next();
                            $location.path('/apply/current-account/finish').replace();
                        }
                    }
                });
        };
    });
})(angular.module('refresh.accountOrigination.currentAccount.screens.acceptOffer', ['refresh.flow',
    'refresh.accountOrigination.currentAccount.services.currentAccountOffersService',
    'refresh.configuration',
    'refresh.notifications.service',
    'refresh.accountOrigination.currentAccount.domain.currentAccountApplication']));
