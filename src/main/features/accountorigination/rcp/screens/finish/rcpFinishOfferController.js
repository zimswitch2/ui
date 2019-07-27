(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.rcp.screens.finishOffer',
        [
            'ngRoute',
            'refresh.card',
            'refresh.authenticationService',
            'refresh.accountOrigination.rcp.domain.rcpApplication',
            'refresh.common.homeService'
        ]);

    app.config(function ($routeProvider) {
        var isValidApplicationState = function (RcpApplication) {
            return RcpApplication.isInProgress();
        };

        $routeProvider.when('/apply/rcp/finish', {
            templateUrl: 'features/accountorigination/rcp/screens/finish/partials/rcpFinishOffer.html',
            controller: 'RcpFinishOfferController',
            allowedFrom: [{path: '/apply/rcp/confirm', condition: isValidApplicationState}],
            safeReturn: '/apply'
        });
    });

    app.controller('RcpFinishOfferController', function ($scope, $location, RcpApplication, AccountsService, Card,
                                                         AuthenticationService, HomeService, CustomerInformationData) {
        var selection = RcpApplication.selection();

        $scope.debitOrder = selection.debitOrder;
        $scope.isCustomerKycCompliant  = CustomerInformationData.current().isKycCompliant();
        $scope.rcpOfferDetails = RcpApplication.offer().rcpOfferDetails;
        $scope.offerConfirmationDetails = RcpApplication.offerConfirmationDetails();
        $scope.preferredBranch = selection.selectedBranch.name;
        $scope.requestedLimit = selection.requestedLimit;

        AccountsService.hasPrivateBankingAccount(Card.current()).then(function (hasPrivateCurrentAccount) {
            $scope.hasPrivateBankingAccount = hasPrivateCurrentAccount;
        });

        var newToBank = !Card.anySelected();
        $scope.finishApplicationText = newToBank ? 'Sign-out' : 'Back';

        $scope.finishApplication = function () {
            if (newToBank) {
                AuthenticationService.logout();
            } else {
                HomeService.goHome();
            }
        };
    });
}());
