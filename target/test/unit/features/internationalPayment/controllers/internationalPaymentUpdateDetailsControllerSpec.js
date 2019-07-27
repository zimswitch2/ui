describe('Unit Test - International Payment Update Details Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentUpdateDetailsController', 'refresh.test'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment update details controller', function () {
            expect(route.routes['/international-payment/update-details'].controller).toBe('InternationalPaymentUpdateDetailsController');
        });

        it('should load the international payment update details template', function () {
            expect(route.routes['/international-payment/update-details'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentUpdateDetails.html');
        });
    });

    describe('controller', function() {
        var controller, scope, mock, internationalPaymentCustomer;

        function invokeController() {
            controller('InternationalPaymentUpdateDetailsController', {
                $scope: scope,
                InternationalPaymentCustomer: internationalPaymentCustomer
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, _mock_, InternationalPaymentCustomer) {
            controller = $controller;
            scope = $rootScope.$new();
            mock = _mock_;
            internationalPaymentCustomer = InternationalPaymentCustomer;
        }));

        describe('when initializing', function() {
           it('should set the customer isResident value on the scope', function(){
                var customerDetails = {
                    isResident: true
                };

               internationalPaymentCustomer.initialize(customerDetails);

               invokeController();

               expect(scope.isResident).toBeTruthy();
           });
        });
    });
});
