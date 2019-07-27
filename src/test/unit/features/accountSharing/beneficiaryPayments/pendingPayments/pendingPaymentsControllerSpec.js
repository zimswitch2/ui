
describe('pending payments', function(){
    'use strict';

    var locationPathSpy;

    var expectedPendingPayments =
        [
            {
                "beneficiaryName" : "Alpha",
                "beneficiaryAccount" : "123456",
                "description" : "Plumbing - as per our agreement",
                "amount" : 2000,
                "currency" : "R",
                "yourReference" : "12345",
                "beneficiaryReference" : "67890",
                "status" : "pending"
            },
            {
                "beneficiaryName" : "Bravo",
                "beneficiaryAccount" : "123457",
                "description" : "Security",
                "amount" : 1500,
                "currency" : "R",
                "yourReference" : "12346",
                "beneficiaryReference" : "67891",
                "status" : "pending"
            }
        ];

    beforeEach(module('refresh.accountSharing.pendingPayments'));

    describe("routes", function(){
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        describe("when getting pending payments", function(){
            it("should use the correct template", function(){
                var pendingPaymentsRoute = route.routes['/account-sharing/pendingPayments'];
                expect(pendingPaymentsRoute.templateUrl).toEqual('features/accountSharing/beneficiaryPayments/pendingPayments/pendingPayments.html');
            });

            it('should use the correct controller', function(){
                var pendingPayments = route.routes['/account-sharing/pendingPayments'];
                expect(pendingPayments.controller).toEqual('PendingPaymentsController');
            });
        });
    });

    function getController(pendingPayments) {

        var controller;

        inject(function($controller, $rootScope, _mock_, $location){
            var entitlementsBeneficiaryPaymentService = jasmine.createSpyObj('entitlementsBeneficiaryPaymentService', ['getPendingPayments']);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(_mock_.resolve(pendingPayments));
            var pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
            locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);
            controller = $controller('PendingPaymentsController', {
                EntitlementsBeneficiaryPaymentService : entitlementsBeneficiaryPaymentService
            });

            $rootScope.$digest();
        });

        return controller;
    }

    describe("pendingPayments", function(){
        it("should return all pending payments", function(){
            var controller = getController(expectedPendingPayments);

            expect(controller.pendingPayments).toEqual(expectedPendingPayments);
        });

        it("should set the numberOfPending transactions to a correct value", function(){
            var controller = getController(expectedPendingPayments);

            expect(controller.numberOfPendingTransactions).toEqual(2);
        });

        it("Should set numberOfPendingTransaction to zero is none is returned", function(){
            var controller = getController(undefined);
            expect(controller.numberOfPendingTransactions).toEqual(0);
        });

        it("Back button should navigate back to tiles", function(){
            var controller = getController(expectedPendingPayments);

            controller.back();
            expect(locationPathSpy).toHaveBeenCalledWith('/transaction/dashboard');
        });
    });

    describe("pendingPayments", function() {
        it("should have a description made up of yourReference and reason for payment", function () {
            var controller = getController(expectedPendingPayments);
            var result = controller.formatDescription("Your Reference", "Payment Reason");
            expect(result).toEqual("Your Reference - Payment Reason");
        });

        it("should have a description made up of yourReference only if reason for payment is not captured", function () {
            var controller = getController(expectedPendingPayments);
            var result = controller.formatDescription("Your Reference", undefined);
            expect(result).toEqual("Your Reference");
        });
    });
});