describe('view rejected payment details', function(){
    'use strict';

    var locationPathSpy, listSpy, entitlementsBeneficiaryPaymentService, scope;

    var expectedRejectedPayment =
            {
                "paymentNotificationMethod": "Email",
                "accountNumber": "123456789",
                "beneficiaryName": "M Monte",
                "beneficiaryEmail": "accounts@flowers.com",
                "beneficiaryCell": "27829266693",
                "beneficiaryFax": "6364565666",
                "beneficiaryAccount": "12345",
                "rejectedBy": "Joanna",
                "reasonForPayment": "Payment to the flower delivery company",
                "reasonForRejection": "Incomplete payment",
                "paymentNotification": true,
                "beneficiaryReference": "Test Bene",
                "customerReference": "Test",
                "paymentDate": "2016-03-19T00:00:00Z",
                "amount": 400
            };
    var accountData = {
        accounts : [{
                          accountFeature: [
                              {
                                  feature: 'PAYMENTFROM',
                                  value: true
                              }
                          ],
                          formattedNumber: '12-34-567-890-0',
                          number: '123456789',
                          availableBalance:
                          {
                              amount: 9000.0
                          },
                          name: 'CURRENT'
                   }]
    };

    beforeEach(module('refresh.accountSharing.rejectedPayments','refresh.accountSharing.beneficiaryPayments'));

    describe("routes", function(){
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        describe("when getting rejected payment details", function(){
            it("should use the correct template", function(){
                var rejectedPaymentsRoute = route.routes['/account-sharing/rejectedPayments/viewRejectedPayment'];
                expect(rejectedPaymentsRoute.templateUrl).toEqual('features/accountSharing/beneficiaryPayments/viewPaymentsDetails.html');
            });

            it('should use the correct controller', function(){
                var rejectedPayments = route.routes['/account-sharing/rejectedPayments/viewRejectedPayment'];
                expect(rejectedPayments.controller).toEqual('ViewRejectedPaymentsController');
            });
        });
    });

    function getController(rejectedPayment) {

        var controller, card, accountsService;

        inject(function($controller, $rootScope, _mock_, AccountsService, EntitlementsBeneficiaryPaymentService, $location){
            entitlementsBeneficiaryPaymentService = EntitlementsBeneficiaryPaymentService;

            spyOn(entitlementsBeneficiaryPaymentService, ['getRejectedPaymentsDetails']);

            var pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
            locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);
            card = jasmine.createSpyObj('card', ['current']);
            entitlementsBeneficiaryPaymentService.getRejectedPaymentsDetails.and.returnValue(rejectedPayment);

            scope = $rootScope.$new();

            listSpy = spyOn(AccountsService, 'list');
            listSpy.and.returnValue(_mock_.resolve({
                accounts: accountData
            }));

            accountsService = AccountsService;

            controller = $controller('ViewRejectedPaymentsController', {
                $scope : scope,
                Card : card,
                AccountsService : accountsService,
                EntitlementsBeneficiaryPaymentService : entitlementsBeneficiaryPaymentService
            });
            $rootScope.$digest();
        });

        return controller;
    }

    describe("viewRejectedPayment", function(){

        it('should set the payment detail on the scope', function() {
            var controller = getController(expectedRejectedPayment);
            expect(scope.payment).toBeTruthy();
        });

        it("should set the email as payment notification address as per payment notification method.", function(){
            var controller = getController(expectedRejectedPayment);
            controller.setPaymentNotificationAddress();
            expect(scope.payment.paymentNotificationAddress).toEqual("accounts@flowers.com");
        });

        it("should set the SMS as payment notification address as per payment notification method.", function(){
            expectedRejectedPayment.paymentNotificationMethod="SMS";
            var controller = getController(expectedRejectedPayment);
            controller.setPaymentNotificationAddress();
            expect(scope.payment.paymentNotificationAddress).toEqual("27829266693");
        });

        it("should set the Fax as payment notification address as per payment notification method.", function(){
            expectedRejectedPayment.paymentNotificationMethod="Fax";
            var controller = getController(expectedRejectedPayment);
            controller.setPaymentNotificationAddress();
            expect(scope.payment.paymentNotificationAddress).toEqual("6364565666");
        });

        it("should not display payment notification field if payment notification method is null.", function(){
            expectedRejectedPayment.paymentNotificationMethod = "";
            var controller = getController(expectedRejectedPayment);
            controller.setPaymentNotificationAddress();
            expect(scope.payment.paymentNotification).toEqual(false);
        });

        it('should set the correct account', function () {
            var controller = getController(expectedRejectedPayment);
            controller.setAccountData(accountData);
            expect(scope.account).toEqual(accountData.accounts[0]);
        });
    });
});