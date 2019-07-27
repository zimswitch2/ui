var accountSharingEnabled = false;
if (feature.accountSharing) {
    accountSharingEnabled = true;
}
describe("Pending Payments Widget Controller", function () {
    var rootScope, scope, mock, controller, invokeController, entitlementsBeneficiaryPaymentService, user;
    var expectedPendingPayments =
        [
            {
                "beneficiaryName": "Alpha",
                "beneficiaryAccount": "123456",
                "description": "Plumbing - as per our agreement",
                "amount": 2000,
                "currency": "R",
                "yourReference": "12345",
                "beneficiaryReference": "67890",
                "status": "pending"
            },
            {
                "beneficiaryName": "Bravo",
                "beneficiaryAccount": "123457",
                "description": "Security",
                "amount": 1500,
                "currency": "R",
                "yourReference": "12346",
                "beneficiaryReference": "67891",
                "status": "pending"
            }
        ];
    beforeEach(module('refresh.accountSharing.beneficiaryPayments'));

    beforeEach(inject(function ($rootScope, $controller, $injector, _mock_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        mock = _mock_;
        controller = $controller;


        rootScope.$broadcast('loggedIn');

        user = jasmine.createSpyObj('User', ['isCurrentDashboardSEDPrincipal', 'isCurrentDashboardCardHolder']);
        entitlementsBeneficiaryPaymentService = jasmine.createSpyObj('entitlementsBeneficiaryPaymentService', ['getPendingPayments']);
        entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(_mock_.resolve(expectedPendingPayments));

        invokeController = function () {
            $controller('PendingPaymentsWidgetController',
                {
                    $scope: scope,
                    EntitlementsBeneficiaryPaymentService: entitlementsBeneficiaryPaymentService,
                    User: user
                });
        };

        invokeController();
    }));

    describe('Pending transactions ', function () {
        it('Should return all pending transactions', function () {
           user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            scope.availablePendingTransactions();
            scope.$digest();
            expect(scope.pendingTransactions).toEqual(expectedPendingPayments);
        });

        it('Should set the number of pending transactions to the correct value', function () {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            scope.initialize();
            scope.$digest();
            expect(scope.numberOfPendingTransactions).toEqual(2);
        });

        it('Should only have one pending transaction', function () {
            var response = [{
                "beneficiaryName": "Alpha",
                "beneficiaryAccount": "123456",
                "description": "Plumbing - as per our agreement",
                "amount": 2000,
                "currency": "R",
                "yourReference": "12345",
                "beneficiaryReference": "67890",
                "status": "pending"
            }];
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(mock.resolve(response));
            scope.initialize();
            scope.$digest();
            expect(scope.hasOnlyOnePendingTransaction()).toBeTruthy();
        });

        it('Should only have one pending transaction', function () {
            user.isCurrentDashboardCardHolder.and.returnValue(true);
            scope.pendingTransactions = [];
            expect(scope.hasOnlyOnePendingTransaction()).toBeFalsy();
        });

        it('Should have no pending transaction', function () {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(mock.resolve(undefined));
            scope.initialize();
            scope.$digest();
            expect(scope.numberOfPendingTransactions).toEqual(0);
        });

        it('Should only have one Repeat Payment pending transaction', function () {
            var response = [{
                "beneficiaryName": "Alpha",
                "beneficiaryAccount": "123456",
                "description": "Plumbing - as per our agreement",
                "amount": 2000,
                "currency": "R",
                "yourReference": "12345",
                "beneficiaryReference": "67890",
                "status": "pending",
                "transactionType": "repeatPayment"

            }];
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(mock.resolve(response));
            scope.initialize();
            scope.$digest();
            expect(scope.viewName()).toEqual("repeatPayment");
        });

        it('Should only have one Inter Account Payment pending transaction', function () {
            var response = [{
                "beneficiaryName": "Alpha",
                "beneficiaryAccount": "123456",
                "description": "Plumbing - as per our agreement",
                "amount": 2000,
                "currency": "R",
                "yourReference": "12345",
                "beneficiaryReference": "67890",
                "status": "pending",
                "transactionType": "interAccountPayment"
            }];
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(mock.resolve(response));
            scope.initialize();
            scope.$digest();
            expect(scope.viewName()).toEqual("interAccountPayment");
        });

        it('Should only have one Beneficiary pending transaction', function () {
            var response = [{
                "beneficiaryName": "Alpha",
                "beneficiaryAccount": "123456",
                "description": "Plumbing - as per our agreement",
                "amount": 2000,
                "currency": "R",
                "yourReference": "12345",
                "beneficiaryReference": "67890",
                "status": "pending",
                "transactionType": "beneficiaryPayment"
            }];
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(mock.resolve(response));
            scope.initialize();
            scope.$digest();
            expect(scope.viewName()).toEqual("beneficiaryPayment");
        });

        it("Should have no pending transactions", function () {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            scope.pendingTransactions = undefined;
            expect(scope.hasOnlyOnePendingTransaction()).toBeFalsy();
        });

        it('Should have undefined view Name', function () {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(mock.resolve(undefined));
            scope.initialize();
            scope.$digest();
            expect(scope.viewName()).toBeUndefined();
        });
        it("Should have no pending transactions", function () {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            scope.pendingTransactions = [];
            expect(scope.hasPendingTransactions()).toBeFalsy();
        });

        it("Should toggle off the Pending transactions widget",function(){
            accountSharingEnabled = false;
            expect(scope.hasPendingTransactions()).toBeFalsy();
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            scope.initialize();
            scope.$digest();
            expect(scope.numberOfPendingTransactions).toEqual(0);
        });

        it('Should toggle on the Pending transactions widget', function () {
            accountSharingEnabled = true;
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            scope.initialize();
            scope.$digest();
            expect(scope.numberOfPendingTransactions).toEqual(2);
        });


    });

});