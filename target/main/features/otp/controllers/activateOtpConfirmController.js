var caterForInternationalOnActivateOtpFeature = false;

{
    caterForInternationalOnActivateOtpFeature = true;
}

(function () {
    'use strict';

    var module = angular.module('refresh.otp.activate.confirm',
        [
            'ngRoute',
            'refresh.flow',
            'refresh.switch-dashboard.service',
            'refresh.otp.activate.service',
            'refresh.filters'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/otp/activate/confirm/:profileId', {
            templateUrl: 'features/otp/partials/activateConfirm.html',
            controller: 'ActivateOtpConfirmController'
        });
    });

    module.controller('ActivateOtpConfirmController', function ($scope, $location, $routeParams, ActivateOtpService, Flow, ViewModel) {
        $scope.otpPreferences = ViewModel.current();
        var profileId = $routeParams.profileId;

        $scope.activate = function () {
            ActivateOtpService.activate($scope.otpPreferences, profileId).then(function () {
                Flow.next();
                $location.path('/otp/activate/success/' + profileId);
            }).catch(function (error) {
                Flow.previous();

                if(caterForInternationalOnActivateOtpFeature && error.model.preferredMethod === 'SMS') {
                    error.model.contactDetails = {
                        internationalDialingCode: error.model.internationalDialingCode,
                        cellPhoneNumber: error.model.cellPhoneNumber,
                        countryCode: error.model.countryCode
                    };

                    delete error.model.internationalDialingCode;
                    delete error.model.cellPhoneNumber;
                    delete error.model.countryCode;
                }

                ViewModel.current(error.model);
                ViewModel.error(error);
                $location.path('/otp/activate/' + profileId);
            });
        };

        $scope.modify = function () {
            Flow.previous();
            ViewModel.modifying();
            $location.path('/otp/activate/' + profileId);
        };
    });
}());