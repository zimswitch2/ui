describe('view beneficiary details controller', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries.controllers.viewBeneficiaryDetails'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should use the correct controller ', function () {
            expect(route.routes['/beneficiaries/view/:recipientId'].controller).toEqual('ViewBeneficiaryDetailsController');
        });

        it('should use the correct template ', function () {
            expect(route.routes['/beneficiaries/view/:recipientId'].templateUrl).toEqual('features/beneficiaries/partials/viewBeneficiaryDetails.html');
        });
    });

    var scope, mock, listService, scheduledPaymentsService, card, location, routeParams, beneficiariesState,
        beneficiariesService, beneficiaryPayment;

    beforeEach(inject(function ($rootScope, $controller, _mock_, $routeParams, BeneficiaryPayment) {
        scope = $rootScope.$new();
        mock = _mock_;
        beneficiariesState = {};
        listService = jasmine.createSpyObj('listService', ['formattedBeneficiaryList']);
        beneficiariesService = jasmine.createSpyObj('beneficiariesService', ['deleteBeneficiary']);
        beneficiaryPayment = BeneficiaryPayment;

        card = jasmine.createSpyObj('card', ['current']);
        location = jasmine.createSpyObj('$location', ['path']);
        routeParams = $routeParams;
        routeParams.recipientId = '1';

        listService.formattedBeneficiaryList.and.returnValue(mock.resolve([
            {
                recipientId: 1,
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                recentPayment: [
                    {date: '2014-02-03'}
                ]
            },
            {
                recipientId: 2,
                name: 'Test2',
                accountNumber: '4511',
                recipientReference: 'Test',
                customerReference: 'Test',
                recentPayment: [
                    {date: '2014-02-03'}
                ]
            }
        ]));

        $controller('ViewBeneficiaryDetailsController', {
            $scope: scope,
            BeneficiariesListService: listService,
            ScheduledPaymentsService: scheduledPaymentsService,
            Card: card,
            $routeParams: routeParams,
            $location: location,
            BeneficiariesState: beneficiariesState,
            BeneficiariesService: beneficiariesService
        });
    }));

    it('should get the latest beneficiary from the global parameters', function () {
        scope.$digest();
        expect(scope.beneficiary.recipientId).toEqual(parseInt(routeParams.recipientId));
    });

    it('should know if beneficiary is a listed one', function () {
        scope.beneficiary = {originalBeneficiary: {beneficiaryType: 'COMPANY'}};
        expect(scope.isPrivateBeneficiary()).toBeFalsy();
    });

    it('should know if beneficiary is a private one', function () {
        scope.beneficiary = {originalBeneficiary: {beneficiaryType: 'PRIVATE'}};
        expect(scope.isPrivateBeneficiary()).toBeTruthy();
    });

    describe('when editing', function () {
        it('should re-route to the add beneficiary page', function () {
            scope.edit({beneficiaries: ''});
            expect(location.path).toHaveBeenCalledWith('/beneficiaries/edit');
        });

        it('should call the global service with edit beneficiary being set to true', function () {
            scope.edit({beneficiaries: ''});
            expect(beneficiariesState.editBeneficiary).toBe(true);
        });

        it('should call the global service with beneficiary being set to selected value', function () {
            var beneficiary = {beneficiaries: ''};
            scope.edit(beneficiary);
            expect(beneficiariesState.beneficiary).toBe(beneficiary);
        });
    });

    describe('when paying', function () {
        var beneficiary = {name: 'adshuh', recipientId: 23123};
        beforeEach(function () {
            scope.payBeneficiary(beneficiary);
        });

        it('should start beneficiary payment', function () {
            expect(beneficiaryPayment.getBeneficiary()).toBe(beneficiary);
        });

        it('should go to the pay a single beneficiary flow ', function () {
            expect(location.path).toHaveBeenCalledWith('/payment/beneficiary');
        });
    });

    describe('when deleting', function () {
        it('should mark for deletion', function () {
            scope.markForDeletion();
            expect(scope.beingDeleted).toBeTruthy();
        });

        it('should cancel deletion', function () {
            scope.markForDeletion();
            scope.cancelDeletion();
            expect(scope.beingDeleted).toBeFalsy();
        });

        it('should navigate to beneficiary list upon successful deletion', function () {
            scope.beneficiary = {originalBeneficiary: {id: 1}};
            beneficiariesService.deleteBeneficiary.and.returnValue(mock.resolve({}));
            scope.confirmDeletion();
            scope.$digest();

            expect(beneficiariesService.deleteBeneficiary).toHaveBeenCalledWith({id: 1}, card.current());
            expect(location.path).toHaveBeenCalledWith('/beneficiaries/list');
        });

        it('should set error upon unsuccessful deletion', function () {
            scope.beneficiary = {originalBeneficiary: {id: 1}};
            beneficiariesService.deleteBeneficiary.and.returnValue(mock.reject({}));
            scope.confirmDeletion();
            scope.$digest();

            expect(scope.deletionError).toBeTruthy();
        });

        it('should clear error after unsuccessful deletion on cancel', function () {
            scope.beneficiary = {originalBeneficiary: {id: 1}};
            beneficiariesService.deleteBeneficiary.and.returnValue(mock.reject({}));
            scope.confirmDeletion();
            scope.$digest();
            scope.cancelDeletion();

            expect(scope.deletionError).toBeNull();
        });
    });
});
