(function (app) {
    'use strict';

    {
        app.run(function (_$route_, $rootScope, $location, $injector, DigitalId) {
            /*
             * The purpose of the below functionality is to intercept any route
             * change and ratify whether it is coming from an allowed referrer.
             *
             * This will prevent erroneous navigation using the back button, or
             * manual intervention by altering the url.
             */
            $rootScope.$on('$routeChangeStart', function (e, next, current) {
                if (!current) {
                    $location.path('/login').replace();
                    return;
                }

                if (!next || next.originalPath === '/otp/verify') {
                    return;
                }

                var newPath;

                var authenticatedPage = !next.unauthenticated;

                if (authenticatedPage && !DigitalId.isAuthenticated()) {
                    newPath = '/login';
                } else if (!authenticatedPage && DigitalId.isAuthenticated()) {
                    newPath = current && !current.unauthenticated ? current.originalPath : '/login';
                }

                if (next.allowedFrom) {
                    var allowed = _.any(next.allowedFrom, function (item) {
                        if (item instanceof RegExp) {
                            return item.test(current.originalPath);
                        } else if (typeof item === 'string') {
                            return item === current.originalPath;
                        } else {
                            var isValidPath;
                            if (item.path instanceof RegExp) {
                                isValidPath = item.path.test(current.originalPath);
                            } else {
                                isValidPath = item.path === current.originalPath;
                            }
                            var isValidCondition = !item.condition || $injector.invoke(item.condition);
                            return isValidPath && isValidCondition;
                        }
                    });

                    if (!allowed) {
                        newPath = next.safeReturn || current.originalPath;
                    }
                }

                if (newPath) {
                    $location.path(newPath).replace();
                }
            });
        });
    }
})(angular.module('routing.forAllowedFrom', ['refresh.digitalId']));
