describe('Unit Test - International Payment Beneficiary Details Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentBeneficiaryPreferencesController', 'refresh.metadata'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment beneficiary details template', function () {
            expect(route.routes['/international-payment/beneficiary/preferences'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentBeneficiaryPreferences.html');
        });

        it('should load the international payment beneficiary details controller', function () {
            expect(route.routes['/international-payment/beneficiary/preferences'].controller).toBe('InternationalPaymentBeneficiaryPreferencesController');
        });
    });

    describe('controller', function () {
        var controller, scope, location, Flow, internationalPaymentBeneficiary;

        function StaticLookUp(staticValues) {
            return {
                values: function () {
                    return staticValues;
                }
            };
        }

        var LookUps = {
            beneficiaryFee: new StaticLookUp([{code: 1, description: 'You pay all the fees'}])
        };

        function invokeController() {
            controller('InternationalPaymentBeneficiaryPreferencesController', {
                $scope: scope,
                $location: location,
                LookUps: LookUps,
                Flow: Flow
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _Flow_, InternationalPaymentBeneficiary) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            Flow = _Flow_;
            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;
        }));

        it("should set beneficiary details on the scope", function () {
            internationalPaymentBeneficiary.initialize();
            internationalPaymentBeneficiary.current().whatever = 'whatever';

            invokeController();
            expect(scope.beneficiary.whatever).toEqual('whatever');
        });

        it('should create a beneficiary preferences object if it does not exist', function () {
            internationalPaymentBeneficiary.initialize();
            invokeController();

            expect(scope.beneficiary.preferences).toEqual({fee: {code: "OWN", description: 'You pay all the fees'}});
        });

        it('should not create a beneficiary preferences object if it does exists', function () {
            var beneficiary = internationalPaymentBeneficiary.initialize();
            beneficiary.preferences = {
                fee: "SHA"
            };

            invokeController();

            expect(scope.beneficiary.preferences).toEqual({fee: "SHA"});
        });

        describe("list options", function () {
            it("beneficiaryFees", function () {
                internationalPaymentBeneficiary.initialize();
                invokeController();
                expect(scope.beneficiaryFees).toEqual([{code: 1, description: 'You pay all the fees'}]);
            });
        });

        describe("next", function () {
            beforeEach(function () {
                internationalPaymentBeneficiary.initialize();
                spyOn(Flow, 'next');
                invokeController();
                scope.next();
            });

            it('should navigate to international payment reason', function () {
                expect(location.url()).toBe('/international-payment/reason');
            });

            it('should go back to the next step of flow', function () {
                expect(Flow.next).toHaveBeenCalled();
            });
        });

        describe("back", function () {
            beforeEach(function () {
                internationalPaymentBeneficiary.initialize();
                invokeController();
                scope.back();
            });

            it('should navigate to international payment beneficiary bank details', function () {
                expect(location.url()).toBe('/international-payment/beneficiary/bank-details');
            });
        });
    });
});
