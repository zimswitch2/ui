describe('Registration', function () {
    'use strict';

    beforeEach(module('refresh.registration', 'refresh.fixture', 'refresh.navigation', 'refresh.test'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when registration is to be viewed', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/register'].controller).toEqual('RegistrationController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/register'].templateUrl).toEqual('features/registration/partials/register.html');
            });
        });

        describe('when link card is to be viewed', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/linkcard'].controller).toEqual('LinkCardController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/linkcard'].templateUrl).toEqual('features/registration/partials/linkcard.html');
            });

        });
    });
});
