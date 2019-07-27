(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.addUser')
        .run(function($route, $rootScope, AddUserService) {
            $rootScope.$on('$routeChangeStart', function(e, next, current) {
                if (urlNotInFlow(current) && urlInFlow(next)) {
                    AddUserService.setFlowOrigin(current.originalPath);
                }
            });

            $rootScope.$on('$routeChangeSuccess', function(e, current, previous) {
                $route.previous = previous;
            });
        });

    function urlNotInFlow(url) {
        return url && !urlInFlow(url);
    }

    function urlInFlow(url) {
        return url && (_.startsWith(url.originalPath, '/account-sharing/user/') || url.originalPath === '/otp/verify');
    }
})();
