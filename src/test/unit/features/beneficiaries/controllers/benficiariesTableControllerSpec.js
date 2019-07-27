var accountSharing = false;
if(feature.accountSharing) {
    accountSharing = true;
}

describe('beneficiaries table controller', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries.controllers.beneficiariesTable'));

    var scope,
        mock,
        service,
        listService,
        sorter,
        filter,
        card,
        flow,
        location,
        beneficiariesState,
        beneficiaryPayment,
        parameterService,
        permissionsService,
        invokeController,
        user;
    var systemPrincipalIdentifier = {systemPrincipalId: "principalId"};
    beforeEach(inject(function ($rootScope, $controller, _mock_, $sorter, $filter, BeneficiaryPayment) {
        scope = $rootScope.$new();
        mock = _mock_;
        listService = jasmine.createSpyObj('listService', ['formattedBeneficiaryList', 'isBeneficiaryValid']);
        listService.formattedBeneficiaryList.and.returnValue(mock.resolve([]));
        listService.isBeneficiaryValid.and.returnValue(mock.resolve(true));
        service = jasmine.createSpyObj('service', ['deleteBeneficiary']);
        beneficiariesState = {};
        beneficiaryPayment = BeneficiaryPayment;
        parameterService = jasmine.createSpyObj('parameterService', ['pushVariable', 'getVariable']);
        card = jasmine.createSpyObj('card', ['current']);
        flow = jasmine.createSpyObj('Flow', ['preventNavigation']);
        sorter = $sorter;
        filter = $filter;
        location = jasmine.createSpyObj('$location', ['path']);
        permissionsService = jasmine.createSpyObj('PermissionsService', ['checkPermission']);

        user = jasmine.createSpyObj('User', ['isCurrentDashboardSEDPrincipal']);
        user.isCurrentDashboardSEDPrincipal.and.returnValue(false);

        invokeController = function () {
            $controller('BeneficiariesTableController', {
                $scope: scope,
                $sorter: sorter,
                $filter: filter,
                BeneficiariesListService: listService,
                BeneficiariesService: service,
                BeneficiariesState: beneficiariesState,
                ApplicationParameters: parameterService,
                Card: card,
                Flow: flow,
                $location: location,
                PermissionsService: permissionsService,
                User: user
            });
        };

        invokeController();
    }));

    describe('when delete service call fails', function () {
        beforeEach(inject(function () {
            service.deleteBeneficiary.and.returnValue(mock.reject({
                success: false,
                message: 'Could not delete scheduled payment'
            }));
            invokeController();
            scope.initialize();
            scope.$digest();
        }));

        it('should reject delete promise', function () {
            var toBeDeleted = {somethingForTheView: 'abc', recipientId: 123, originalBeneficiary: {recipientId: 123}};
            var deletePromise = scope.delete(toBeDeleted);
            scope.$digest();
            expect(deletePromise).toBeRejected();
            scope.$digest();
        });
    });

    describe('when sorted', function () {
        it('should set the sort criteria', function () {
            scope.sortBy('field');
            expect(scope.sort.criteria).toEqual('field');
        });
        it('should set the sort order as descending by default', function () {
            scope.sortBy('field');
            expect(scope.sort.descending).toEqual(true);
        });
        it('should toggle the sort order', function () {
            scope.sortBy('field');
            scope.sortBy('field');
            expect(scope.sort.descending).toEqual(false);
        });
    });

    describe('when viewing', function () {
        var beneficiary = {name: "adshuh", recipientId: 23123};
        beforeEach(function () {
            scope.viewBeneficiary(beneficiary.recipientId);
            scope.$digest();
        });

        it('should set the selected beneficiary in the global service variable', function () {
            expect(location.path).toHaveBeenCalledWith('/beneficiaries/view/' + beneficiary.recipientId);
        });

    });

    describe('when editing', function () {
        it('should re-route to the add beneficiary page', function () {
            scope.edit({beneficiaries: ""});
            expect(location.path).toHaveBeenCalledWith("/beneficiaries/edit");
        });

        it('should call the global service with edit beneficiary being set to true', function () {
            scope.edit({beneficiaries: ""});
            expect(beneficiariesState.editBeneficiary).toBe(true);
        });

        it('should call the global service with beneficiary being set to selected value', function () {
            var beneficiary = {beneficiaries: ""};
            scope.edit(beneficiary);
            expect(beneficiariesState.beneficiary).toBe(beneficiary);
        });

    });

    describe('when paying', function () {
        var beneficiary = {
            name: "adshuh", recipientId: 23123, paymentConfirmation: {
                confirmationType: 'Fax'
            }
        };
        beforeEach(function () {
            scope.payBeneficiary(beneficiary);
        });

        it('should start a new beneficiary payment', function () {
            expect(beneficiaryPayment.getBeneficiary()).toEqual(
                {
                    name: "adshuh",
                    recipientId: 23123,
                    paymentConfirmation: {
                        confirmationType: 'Fax'
                    }
                }
            );
        });

        it('should go to the pay a single beneficiary flow ', function () {
            expect(location.path).toHaveBeenCalledWith('/payment/beneficiary');
        });
    });

    describe('when paying from SED dashboard', function(){
        var beneficiary = {
            name: "adshuh", recipientId: 23123, paymentConfirmation: {
                confirmationType: 'Fax'
            }
        };

        it('should go to the pay a single beneficiary flow fs beneficiary is valid and dashboard is SED', function(){
            user = jasmine.createSpyObj('User', ['isCurrentDashboardSEDPrincipal']);
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            listService.isBeneficiaryValid.and.returnValue(mock.resolve(function(){
                return true;
            }));
            invokeController();
            scope.payBeneficiary(beneficiary);
            expect(location.path).toHaveBeenCalledWith('/payment/beneficiary');
        });

        it('should not go to the pay a single beneficiary flow is beneficiary is deleted and dashboard is SED', function(){
            user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
            listService.isBeneficiaryValid.and.returnValue(mock.resolve(true));
            invokeController();
            scope.payBeneficiary(beneficiary);
            expect(location.path).not.toHaveBeenCalledWith('/payment/beneficiary');
        });
    });

    describe('when deleting', function () {
        it('should indicate a beneficiary is in the process of being deleted', function () {
            scope.beingDeleted = {recipientId: 3};
            expect(scope.isBeingDeleted({recipientId: 3})).toEqual(true);
        });

        it('should indicate a beneficiary is NOT in the process of being deleted', function () {
            scope.beingDeleted = {recipientId: 13131231};
            expect(scope.isBeingDeleted({recipientId: 863})).toEqual(false);
        });

        it('should indicate that NO beneficiary is in the process of being deleted', function () {
            scope.beingDeleted = undefined;
            expect(scope.isBeingDeleted({recipientId: 94373})).toEqual(false);
        });
    });

    describe("when filtering", function () {
        it("should clear the filter", function () {
            scope.query = "something";
            scope.resetFilter();
            expect(scope.query).toEqual('');
        });

        it("should clear the filter when event called", function () {
            scope.query = "something";
            scope.$broadcast('resetFilter');
            expect(scope.query).toEqual('');
        });
    });

    describe('when a beneficiary is deleted', function () {
        var toBeDeleted;
        var toBeKept;

        beforeEach(function () {
            card.current.and.returnValue({number: 'ABC123'});
            service.deleteBeneficiary.and.returnValue(mock.response({}, 204, {
                'x-sbg-response-code': "0000",
                'x-sbg-response-type': "SUCCESS"
            }));

            toBeDeleted = {somethingForTheView: 'abc', recipientId: 123, originalBeneficiary: {recipientId: 123}};
            toBeKept = {somethingForTheView: 'def', recipientId: 456, originalBeneficiary: {recipientId: 456}};
            scope.beneficiaries = [
                toBeDeleted,
                toBeKept
            ];

            scope.beingDeleted = toBeDeleted;

            scope.delete(toBeDeleted);
            scope.$digest();
        });

        it('should effectively delete beneficiary from backend', function () {
            expect(service.deleteBeneficiary).toHaveBeenCalledWith(toBeDeleted.originalBeneficiary, {number: 'ABC123'});
        });
        it("should have a confirm delete message", function () {
            var beneficiary = scope.beneficiaries[0];
            expect(scope.confirmDeleteMessage(beneficiary)).toEqual('Delete ' + beneficiary.name + '? Any scheduled future payments will be cancelled');
        });

        it('should have a error delete message', function () {
            var beneficiary = scope.beneficiaries[0];
            expect(scope.errorDeleteMessage(beneficiary)).toEqual('Could not delete beneficiary ' + beneficiary.name + ', try again later.');
        });


        it('should delete beneficiary from the list', function () {
            scope.$digest();
            expect(scope.beneficiaries.length).toEqual(1);
            expect(scope.beneficiaries[0]).toEqual(toBeKept);
        });
    });

    it('should mark a beneficiary for deletion', function () {
        scope.markForDeletion({recipientId: 23123});
        expect(scope.isBeingDeleted({recipientId: 23123})).toBeTruthy();
    });

    describe('is initialized', function () {
        var beneficiaries = [
            {
                recipientId: "1",
                name: "Test",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 0}}
                ],
                recipientGroup: {
                    'name': 'Group 1',
                    'oldName': null,
                    'orderIndex': "1"
                }
            },
            {
                recipientId: "2",
                name: "Test2",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 10}}
                ],
                recipientGroup: null
            }
        ];

        var expectedFormattedBeneficiaries = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 0,
                recipientGroupName: 'Group 1',
                canSelect: false,
                originalBeneficiary: beneficiaries[0],
                selectedClass: ""
            },
            {
                recipientId: '2',
                name: 'Test2',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: moment("2014-02-03"),
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 10,
                recipientGroupName: "",
                canSelect: true,
                originalBeneficiary: beneficiaries[1],
                selectedClass: ""
            }
        ];

        beforeEach(function () {
            card.current.and.returnValue({number: '123ABC'});
            listService.formattedBeneficiaryList.and.returnValue(mock.resolve(expectedFormattedBeneficiaries));
            scope.beingDeleted = {recipientId: 5};
            scope.deletionStatus = 'success';
            scope.initialize();
            scope.$apply();
        });

        it('should clear the error message in the beneficiaries parameters', function () {
            expect(beneficiariesState.errorMessage).toBeUndefined();
        });

        describe('for account sharing feature', function () {

            it('should change filter message for capturer if toggle is on', inject(function () {
                accountSharing = true;
                permissionsService.checkPermission.and.returnValue(false);
                scope.initialize();
                expect(scope.placeHolderMessage).toEqual('Search by name, reference or group');
            }));

            it('should not change filter message for non-capturer', inject(function () {
                accountSharing = false;
                permissionsService.checkPermission.and.returnValue(true);
                scope.initialize();
                expect(scope.placeHolderMessage).toEqual('Search by name, reference, group, date or amount');
            }));

            it('should not change filter message if toggle is off', inject(function () {
                accountSharing = false;
                scope.initialize();
                expect(scope.placeHolderMessage).toEqual('Search by name, reference, group, date or amount');
            }));

            it('should, for capturer, change the message to display when there are no beneficiaries if toggle is on', inject(function () {
                accountSharing = true;
                permissionsService.checkPermission.and.returnValue(false);
                scope.initialize();
                expect(scope.noBeneficiariesMessage).toEqual('There are no beneficiaries linked to your profile.');
            }));

            it('should, for a non-capturer, change the message to display when there are no beneficiaries', inject(function () {
                permissionsService.checkPermission.and.returnValue(true);
                scope.initialize();
                expect(scope.noBeneficiariesMessage).toEqual('There are no beneficiaries linked to your profile. Please add a beneficiary in order to pay.');
            }));

            it('should not change the message to display when there are no beneficiaries if toggle is off', inject(function () {
                accountSharing = false;
                permissionsService.checkPermission.and.returnValue(true);
                scope.initialize();
                expect(scope.noBeneficiariesMessage).toEqual('There are no beneficiaries linked to your profile. Please add a beneficiary in order to pay.');
            }));
        });

        it('should get the list of beneficiaries', function () {
            expect(listService.formattedBeneficiaryList).toHaveBeenCalledWith({number: '123ABC'});
            expect(scope.beneficiaries).toEqual(expectedFormattedBeneficiaries);
        });

        it('should have beneficiary list in scope', function () {
            expect(scope.beneficiaryList).toEqual(expectedFormattedBeneficiaries);
        });

        it('should set the sorter', function () {
            expect(scope.sortBy).toEqual(sorter);
        });

        it('should sort by beneficiary name', function () {
            expect(scope.sort.criteria).toEqual('name');
        });

        it('should sort in descending order', function () {
            expect(scope.sort.descending).toEqual(true);
        });

        it('should have the sort arrow icon on the name column by default', function () {
            expect(scope.sortArrowClass("")).toEqual('icon icon-sort');
        });

        it('should set the clicked column as active', function () {
            expect(scope.sortArrowClass('name')).toEqual('active icon icon-sort');
        });

        it('should reset deletion-related flags', function () {
            expect(scope.beingDeleted).toBeFalsy();
        });
    });

    describe('sorting on empty group fields', function () {

        var beneficiaries = [
            {
                recipientId: "1",
                name: "Test",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 0}}
                ],
                recipientGroup: {
                    'name': 'Group 1',
                    'oldName': null,
                    'orderIndex': "1"
                }
            },
            {
                recipientId: "2",
                name: "Test2",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 10}}
                ],
                recipientGroup: null
            }
        ];

        var expectedFormattedBeneficiaries = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 0,
                recipientGroupName: 'Group 1',
                canSelect: false,
                originalBeneficiary: beneficiaries[0],
                selectedClass: ""
            },
            {
                recipientId: '2',
                name: 'Test2',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: moment("2014-02-03"),
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 10,
                recipientGroupName: "",
                canSelect: true,
                originalBeneficiary: beneficiaries[1],
                selectedClass: ""
            }
        ];

        var beneficiariesWithoutAGroup = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 0,
                recipientGroupName: "",
                canSelect: false,
                originalBeneficiary: beneficiaries[0],
                selectedClass: ""
            },
            {
                recipientId: '2',
                name: 'Test2',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: moment("2014-02-03"),
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 10,
                recipientGroupName: "",
                canSelect: true,
                originalBeneficiary: beneficiaries[1],
                selectedClass: ""
            }
        ];

        it('should set the non-zero group flag to false when the list of beneficiaries contains no beneficiary belonging to a group', function () {
            listService.formattedBeneficiaryList.and.returnValue(mock.resolve(beneficiariesWithoutAGroup));
            scope.initialize();
            scope.$apply();
            expect(scope.hasGroup).toBeFalsy();
        });

        it('should set the non-zero group flag to true when the list of beneficiaries contains at least one beneficiary belonging to a group', function () {
            listService.formattedBeneficiaryList.and.returnValue(mock.resolve(expectedFormattedBeneficiaries));
            scope.initialize();
            scope.$apply();
            expect(scope.hasGroup).toBeTruthy();
        });
    });

    describe('sorting on empty payment fields', function () {

        var beneficiaries = [
            {
                recipientId: "1",
                name: "Test",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 0}}
                ],
                recipientGroup: {
                    'name': 'Group 1',
                    'oldName': null,
                    'orderIndex': "1"
                }
            },
            {
                recipientId: "2",
                name: "Test2",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 10}}
                ],
                recipientGroup: null
            }
        ];

        var expectedFormattedBeneficiaries = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 0,
                recipientGroupName: 'Group 1',
                canSelect: false,
                originalBeneficiary: beneficiaries[0],
                selectedClass: ""
            },
            {
                recipientId: '2',
                name: 'Test2',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: moment("2014-02-03"),
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 10,
                recipientGroupName: "",
                canSelect: true,
                originalBeneficiary: beneficiaries[1],
                selectedClass: ""
            }
        ];

        var beneficiariesWithoutPayment = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: undefined,
                amountPaid: 0,
                recipientGroupName: "",
                canSelect: false,
                originalBeneficiary: beneficiaries[0],
                selectedClass: ""
            },
            {
                recipientId: '2',
                name: 'Test2',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: undefined,
                amountPaid: 10,
                recipientGroupName: "",
                canSelect: true,
                originalBeneficiary: beneficiaries[1],
                selectedClass: ""
            }
        ];

        it('should set the non-zero payment flag to false when the list of beneficiaries contains no beneficiary with a payment', function () {
            listService.formattedBeneficiaryList.and.returnValue(mock.resolve(beneficiariesWithoutPayment));
            scope.initialize();
            scope.$apply();
            expect(scope.hasPayment).toBeFalsy();
        });

        it('should set the non-zero group flag to true when the list of beneficiaries contains at least one beneficiary with a payment', function () {
            listService.formattedBeneficiaryList.and.returnValue(mock.resolve(expectedFormattedBeneficiaries));
            scope.initialize();
            scope.$apply();
            expect(scope.hasPayment).toBeTruthy();
        });
    });

    describe('beneficiary added', function () {
        beforeEach(function () {
            listService.formattedBeneficiaryList.and.returnValue(mock.resolve([
                {
                    recipientId: "1",
                    name: "Test",
                    accountNumber: "211",
                    recipientReference: "Test",
                    customerReference: "Test",
                    recentPayment: [
                        {date: "2014-02-03"}
                    ]
                },
                {
                    recipientId: "2",
                    name: "Test2",
                    accountNumber: "4511",
                    recipientReference: "Test",
                    customerReference: "Test",
                    recentPayment: [
                        {date: "2014-02-03"}
                    ]
                }
            ]));
        });

        it('should get the latest beneficiary from the global parameters', function () {
            scope.initialize();
            scope.$digest();
            expect(scope.beneficiaries[0].recipientId).toEqual("1");

        });

        it('should set the latest beneficiary  as the highlighted beneficiary', function () {
            beneficiariesState.addBeneficiaryFlow = true;
            beneficiariesState.latestBeneficiaryRecipientID = '1';
            scope.initialize();
            scope.$digest();
            expect(scope.highlightBeneficiary.highlightClass).toEqual("highlight");
        });

        it('should reset highlighted beneficiary', function () {
            beneficiariesState.addBeneficiaryFlow = true;
            beneficiariesState.latestBeneficiaryRecipientID = '1';
            scope.initialize();
            scope.$digest();
            scope.sortArrowClass('');
            expect(scope.highlightBeneficiary.highlightClass).toEqual("");
        });
    });
});
