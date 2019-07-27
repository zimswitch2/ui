(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.currentAccount.screens.declinedOffer', [
        'refresh.flow',
        'refresh.configuration',
        'refresh.security.user',
        'refresh.accountOrigination.common.services.accountOriginationProvider'
    ]);

    app.config(function ($routeProvider, $compileProvider) {
        $routeProvider.when('/apply/:product/declined', {
            templateUrl: 'features/accountorigination/currentaccount/screens/declinedoffer/partials/declinedOffer.html',
            controller: 'CurrentAccountDeclinedOfferController'
        });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    });

    app.controller('CurrentAccountDeclinedOfferController', function ($scope, $location, $routeParams, AccountOriginationProvider, URL, User, Card) {
        $scope.product = $routeParams.product;
        var offer = AccountOriginationProvider.for($scope.product).application.offer();

        $scope.title = 'Application Declined';
        $scope.declinedMessage = "We regret to inform you that your application was declined. If you have any questions, please call us on 0860 123 000.";
        $scope.declinedOfferMessage = offer.message;
        $scope.declineLetterDocumentURL = URL.accountOriginationDeclineLetter;
        $scope.isCurrentAccountApplication = $scope.product === 'current-account';
        $scope.newToBankCustomer = !Card.anySelected();

        if (User.hasBasicCustomerInformation()) {
            var userPrincipal = User.principal().systemPrincipalIdentifier;

            $scope.systemPrincipalId = userPrincipal.systemPrincipalId;
            $scope.systemPrincipalKey = userPrincipal.systemPrincipalKey;
            $scope.applicationNumber = offer.applicationNumber;
        }

        if ($scope.declinedOfferMessage === "You already have a Revolving Credit Plan (RCP). If you want to increase your RCP limit, please visit your nearest branch. Don't forget that you can borrow again up to your original loan amount as soon as you repay 15% of your loan.") {
            $scope.title = 'Application Result';
            $scope.declinedMessage = $scope.declinedOfferMessage;
        }
    });

})();