var viewOverviewPageFeature = false;



(function (app) {
    'use strict';

    function SwitchDashboardService($location, User, ApplicationParameters, ActivateOtpService, Flow, DigitalId, HomeService, PermissionsService) {
        function switchToDashboard(dashboard) {
            if (dashboard.cardError) {
                if (dashboard.requiresActivateOTP()) {
                    return $location.path('/otp/activate/' + dashboard.profileId);
                } else if (dashboard.requiresAmendAccessDirect()) {
                    Flow.create([''], 'Activate your internet banking', '', false);
                    return ActivateOtpService.amendAccessDirect(dashboard.profileId)
                        .then(function () {
                            return switchToDashboard(dashboard);
                        });
                } else {
                    ApplicationParameters.pushVariable('loginError', dashboard.cardError.message);
                    DigitalId.remove();
                    return $location.path("/login");
                }
            } else {
                if (dashboard.systemPrincipalKey === 'SED') {
                    PermissionsService.loadPermissionsForDashboard(dashboard).then(function (permissions) {
                        dashboard.permissions = permissions;

                        User.switchToDashboard(dashboard);
                        HomeService.goHome();
                    });
                } else {
                    User.switchToDashboard(dashboard);
                    HomeService.goHome();
                }
            }
        }

        return {
            switchToDashboard: switchToDashboard
        };
    }
    app.service('SwitchDashboardService', SwitchDashboardService);
})(angular.module('refresh.switch-dashboard.service', ['refresh.security.user', 'refresh.otp.activate', 'refresh.flow', 'refresh.digitalId', 'refresh.common.homeService', 'refresh.permissions']));
