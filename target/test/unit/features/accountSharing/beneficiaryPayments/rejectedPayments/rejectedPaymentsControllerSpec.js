describe('rejected payments', function(){
    'use strict';

    var locationPathSpy, entitlementsBeneficiaryPaymentService;

    var expectedRejectedPayments =
        [
            {
                "paymentNotificationMethod": "Email",
                "beneficiaryName": "M Monte",
                "beneficiaryEmail": "accounts@flowers.com",
                "beneficiaryCell": "27829266693",
                "beneficiaryFax": "",
                "beneficiaryAccount": "12345",
                "rejectedBy": "Joanna",
                "reasonForPayment": "Payment to the flower delivery company",
                "reasonForRejection": "Incomplete payment",
                "paymentNotification": true,
                "beneficiaryReference": "Test Bene",
                "customerReference": "Test",
                "paymentDate": "2016-03-19T00:00:00Z",
                "amount": 400
            },
            {
                "paymentNotificationMethod": "SMS",
                "beneficiaryName": "M Monte 2",
                "beneficiaryEmail": "accounts@flowers.com",
                "beneficiaryCell": "27829266693",
                "beneficiaryFax": "",
                "beneficiaryAccount": "12345",
                "rejectedBy": "Joanna",
                "reasonForPayment": "Payment to the flower delivery company",
                "reasonForRejection": "Incomplete payment",
                "paymentNotification": true,
                "beneficiaryReference": "Test Bene",
                "customerReference": "Test",
                "paymentDate": "2016-03-19T00:00:00Z",
                "amount": 400
            },
            {
                "paymentNotificationMethod": "Email",
                "beneficiaryName": "M Monte 3",
                "beneficiaryEmail": "accounts@flowers.com",
                "beneficiaryCell": "27829266693",
                "beneficiaryFax": "",
                "beneficiaryAccount": "12345",
                "rejectedBy": "Joanna",
                "reasonForPayment": "Payment to the flower delivery company",
                "reasonForRejection": "Incomplete payment",
                "paymentNotification": true,
                "beneficiaryReference": "Test Bene",
                "customerReference": "Test",
                "paymentDate": "2016-03-19T00:00:00Z",
                "amount": 400
            }
        ];

    beforeEach(module('refresh.accountSharing.rejectedPayments'));

    describe("routes", function(){
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        describe("when getting rejected payments", function(){
            it("should use the correct template", function(){
                var rejectedPaymentsRoute = route.routes['/account-sharing/rejectedPayments'];
                expect(rejectedPaymentsRoute.templateUrl).toEqual('features/accountSharing/beneficiaryPayments/rejectedPayments/rejectedPayments.html');
            });

            it('should use the correct controller', function(){
                var rejectedPayments = route.routes['/account-sharing/rejectedPayments'];
                expect(rejectedPayments.controller).toEqual('RejectedPaymentsController');
            });
        });
    });

    function getController(rejectedPayments) {

        var controller;

        inject(function($controller, $rootScope, _mock_, $location){
            entitlementsBeneficiaryPaymentService = jasmine.createSpyObj('entitlementsBeneficiaryPaymentService', ['getRejectedPayments','setRejectedPaymentDetails']);
            entitlementsBeneficiaryPaymentService.getRejectedPayments.and.returnValue(_mock_.resolve(rejectedPayments));
            var pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
            locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);
            controller = $controller('RejectedPaymentsController', {
                EntitlementsBeneficiaryPaymentService : entitlementsBeneficiaryPaymentService
            });

            $rootScope.$digest();
        });

        return controller;
    }

    describe("rejectedPayments", function(){
        it("should return all rejected payments", function(){
            var controller = getController(expectedRejectedPayments);

            expect(controller.rejectedPayments).toEqual(expectedRejectedPayments);
        });

        it("should set numberOfRejectedTransactions to a correct value", function(){
            var controller = getController(expectedRejectedPayments);
            expect(controller.numberOfRejectedTransactions).toEqual(3);
        });

        it("Should set numberOfRejectedTransaction to zero is none is returned", function(){
            var controller = getController(undefined);
            expect(controller.numberOfRejectedTransactions).toEqual(0);
        });

        it("Back button should navigate back to tiles", function(){
            var controller = getController(expectedRejectedPayments);

            controller.back();
            expect(locationPathSpy).toHaveBeenCalledWith('/transaction/dashboard');
        });

        it("Clicking on any transaction should call entitlementsBeneficiaryPaymentService's setRejectedPaymentDetails method", function(){
            var controller = getController(expectedRejectedPayments);

            var rejectedPayment;

            controller.showDetails(rejectedPayment);
            expect(entitlementsBeneficiaryPaymentService.setRejectedPaymentDetails).toHaveBeenCalledWith(rejectedPayment);
        });

        it("Clicking on any transaction should navigate to details of the transaction", function(){
            var controller = getController(expectedRejectedPayments);

            var rejectedPayment;

            controller.showDetails(rejectedPayment);
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/rejectedPayments/viewRejectedPayment');
        });
    });
});