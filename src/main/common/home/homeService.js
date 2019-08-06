var overviewFeature = false;
if (feature.overviewPage) {
    overviewFeature = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.common.homeService', ['refresh.security.user']);

    app.factory('HomeService', function ($location, User) {
        return {
            goHome: function () {
                if (overviewFeature) {
                    $location.path('/overview');
                }
                else if (User.hasDashboards()) {
                    $location.path('/account-summary');
                }
                else {
                    $location.path('/new-registered');
                }
                // $location.path('/dashboard/callcenter');
            }
        };
    });
})();
