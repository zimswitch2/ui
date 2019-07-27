(function () {
    'use strict';
    var module = angular.module('refresh.addDashboard.controller',
        [
            'refresh.flow',
            'refresh.registration.service',
            'refresh.security.user'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/addDashboard', {
            templateUrl: 'features/security/partials/addDashboard.html',
            controller: 'AddDashboardController'
        });
    });

    module.controller('AddDashboardController', function ($scope, Flow, RegistrationService, $location, ViewModel,
                                                          User) {

        var url = User.checkAllHotCardedCards() ? '/choose-dashboard': '/dashboards';

        Flow.create(['Enter details', 'Enter OTP', 'Dashboard name'], 'Add Dashboard', url, true);

        $scope.cardData = {};
        $scope.channelProfile = ViewModel.initial();

        var linkCardError = function (errorMessage) {
            $scope.isSuccessful = false;
            $scope.errorMessage = errorMessage;
        };

        $scope.linkAdditionalCard = function () {
            Flow.next();
            RegistrationService.linkAdditionalCard($scope.cardData.cardNumber, $scope.cardData.contactDetails,
                $scope.cardData.atmPIN).then(function (response) {
                    if (response.success) {
                        $scope.channelProfile = response.data;
                        ViewModel.current({channelProfile: $scope.channelProfile, cardNumber: $scope.cardData.cardNumber});
                        Flow.next();
                        $location.path('/addDashboard/saveName');
                    } else {
                        linkCardError(response.message);
                        Flow.previous();
                    }
                });
        };

        $scope.cancel = function () {
            if(User.checkAllHotCardedCards()){
                return $location.path('/choose-dashboard');
            }
            return $location.path('/dashboards');
        };
    });

}());
