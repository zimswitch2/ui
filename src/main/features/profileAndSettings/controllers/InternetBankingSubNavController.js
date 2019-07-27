(function(app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/internet-banking', {
            templateUrl: 'features/profileAndSettings/partials/internetBanking.html',
            controller: 'InternetBankingSubNavController'
        });
    });

    app.controller('InternetBankingSubNavController', function($scope, ViewOTPPreferenceService, ProfilesAndSettingsMenu, Card) {
        $scope.menuItems = ProfilesAndSettingsMenu.getMenu();
        $scope.showOTPPreference = false;
        ViewOTPPreferenceService.getOTPPreference(Card.current()).then(function(response) {
            var deliveryMethod = response.deliveryMethod;

            if(deliveryMethod)
            {
                $scope.viewOTPPreference = {
                    deliveryMethod: (_.isEqual('E', deliveryMethod.toUpperCase()) ? 'Email' : 'SMS'),
                    contact: (_.isNull(response.emailAddr)) ? response.cellNum : response.emailAddr
                };
                $scope.showOTPPreference = true;
            }
        }).catch(function (error) {
            $scope.errorMessage = error.message;
        });
    });
})(angular.module('refresh.profileAndSettings.internetBankingSubNav', ['refresh.viewOTPPreference', 'refresh.card']));
