var newRegisteredPageFeature = false;
{
    newRegisteredPageFeature = true;
}
(function () {
    'use strict';

    var module = angular.module('refresh.newRegistered', ['refresh.parameters', 'refresh.digitalId']);

    module.config(function ($routeProvider) {
        $routeProvider.when('/new-registered',
            {templateUrl: 'features/registration/partials/newRegistered.html', controller: 'NewRegisteredController'});
    });

    module.controller('NewRegisteredController', function ($scope, ApplicationParameters, DigitalId) {
        $scope.isSuccessful = true;
        $scope.passwordHasChanged = ApplicationParameters.popVariable('passwordHasChanged');

        if (newRegisteredPageFeature) {
            $scope.newRegistered = ApplicationParameters.popVariable('newRegistered');
            $scope.preferredName = DigitalId.current().preferredName;
        } else {
            $scope.useOldInternetBanking = false;
        }
    });

})();