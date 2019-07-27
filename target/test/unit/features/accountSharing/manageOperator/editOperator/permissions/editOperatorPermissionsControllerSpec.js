describe('Account Sharing Edit User Permissions Controller', function () {
    'use strict';

    var controller, route, mock;
    var createFlowSpy,
        accountServiceListSpy,
        operatorServiceRolesSpy,
        flowNextSpy,
        locationPathSpy,
        cancelDialogServiceCreateDialogSpy,
        editOperatorPermissionsSpy,
        editOperatorPermissionsCurrentOperatorSpy,
        card;

    var invokeController, resolvePromises;

    var operator = {
        id: 2,
        firstName: 'Joanna'
    };

    var currentCard = {
        number: '12356789012345'
    };

    var accountData = {
        accounts: [{
            accountType: 'CURRENT'
        }]
    };

    var roles = [
        {
            "id": 1,
            "name": "Test Role",
            "description": "Test Role - Test role description goes here"
        }
    ];

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    beforeEach(inject(function ($controller, $location, $rootScope, _mock_, $route, Flow, OperatorService, AccountsService, CancelDialogService, EditOperatorPermissions) {
        route = $route;
        mock = _mock_;

        createFlowSpy = spyOn(Flow, 'create');
        editOperatorPermissionsSpy = spyOn(EditOperatorPermissions, 'editOperatorPermissions');
        editOperatorPermissionsSpy.and.returnValue(mock.resolve(operator));

        editOperatorPermissionsCurrentOperatorSpy  = spyOn(EditOperatorPermissions, 'current');

        accountServiceListSpy = spyOn(AccountsService, 'list');
        accountServiceListSpy.and.returnValue(mock.resolve(accountData));

        operatorServiceRolesSpy = spyOn(OperatorService, 'roles');
        operatorServiceRolesSpy.and.returnValue(mock.resolve(roles));

        flowNextSpy = spyOn(Flow, 'next');
        locationPathSpy = spyOn($location, 'path');
        cancelDialogServiceCreateDialogSpy = spyOn(CancelDialogService, 'createDialog').and.returnValue(mock.resolve());
        card = jasmine.createSpyObj('Card', ['current']);
        card.current.and.returnValue(currentCard);

        resolvePromises = function () {
            $rootScope.$digest();
        };

        invokeController = function (shouldResolvePromises) {
            var ctrl = $controller('EditOperatorPermissionsController', {
                $route: route,
                Card: card
            });

            if (shouldResolvePromises) {
                resolvePromises();
            }

            return ctrl;
        };

        route.current = {params: {id: '2'}};
        route.previous = {originalPath: '/start'};

    }));

    describe('Edit User Details Controller', function () {
        describe('when entering from outside the edit permissions flow', function () {
            beforeEach(function () {
                route.current = {params: {id: '2'}};
                route.previous = {originalPath: '/start'};

                controller = invokeController(true);
            });

            it('should create the flow', function () {
                expect(createFlowSpy).toHaveBeenCalledWith(['Edit', 'Confirm']);
            });

            it('should call editOperatorPersmissionsService passing in the id from route params', function () {
                expect(editOperatorPermissionsSpy).toHaveBeenCalledWith(2);
            });

            it('should expose the operator on the controller', function () {
                expect(controller.user).toEqual(operator);
            });

            it('should call account service passing in the current card', function () {
                expect(accountServiceListSpy).toHaveBeenCalledWith(currentCard);
            });

            it('should contain list of accounts and account type name should be mapped', function () {
                expect(controller.accounts).toEqual([{
                    accountType: 'CURRENT',
                    accountTypeName: 'Current Account'
                }]);
            });

            it('should call operator service roles', function () {
                expect(operatorServiceRolesSpy).toHaveBeenCalled();
            });

            it('should not call current operator on edit operator permissions service', function () {
                expect(editOperatorPermissionsCurrentOperatorSpy).not.toHaveBeenCalled();
            });

            it('should put the roles data on the controller', function () {
                expect(controller.roles).toEqual(roles);
            });
        });

        describe('when entering from within the edit permissions flow', function () {
            var currentOperator = {
                id: 10,
                permissions: []
            };

            beforeEach(function () {
                route.current = {params: {id: '2'}};
                route.previous = {originalPath: '/account-sharing/users/:id/permissions'};

                editOperatorPermissionsCurrentOperatorSpy.and.returnValue(currentOperator);

                controller = invokeController(true);
            });

            it('edit operator permissions should not be called', function () {
                expect(editOperatorPermissionsSpy).not.toHaveBeenCalled();
            });

            it('should call currentOperator on EditOperatorPermissions', function () {
                expect(editOperatorPermissionsCurrentOperatorSpy).toHaveBeenCalled();
            });

            it('should put the current operator on the controller', function () {
                expect(controller.user).toEqual(currentOperator);
            });
        });

        describe('cancel', function () {
            beforeEach(function () {
                controller = invokeController(true);
                controller.cancel();
                resolvePromises();
            });

            it('should call the createDialog service', function () {
                expect(cancelDialogServiceCreateDialogSpy).toHaveBeenCalled();
            });

            it('should navigate back to the user details page', function () {
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2');
            });
        });

        describe('isRoleSelectionValid', function () {
            beforeEach(function () {
                controller = invokeController(true);
            });

            it('should be valid if there is a role selection', function () {
                controller.user.permissions = [{
                    accountReference:{
                        number: '123456'
                    },
                    role: {
                        id: 1,
                        name: 'view'
                    }}];

                expect(controller.isRoleSelectionValid()).toBeTruthy();
            });

            it('should be invalid if there are no roles selected', function () {
                controller.user.permissions  = [];

                expect(controller.isRoleSelectionValid()).toBeFalsy();
            });

            it('should be invalid if user is not present', function () {
                delete controller.user;

                expect(controller.isRoleSelectionValid()).toBeFalsy();
            });
        });

        describe('next', function () {
            beforeEach(function () {
                controller = invokeController(true);
                controller.next();
            });

            it('should call next on flow', function () {
                expect(flowNextSpy).toHaveBeenCalled();
            });

            it('should navigate to the next screen', function () {
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2/permissions/confirm');
            });
        });
    });
});