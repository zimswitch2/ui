describe('Account Sharing Edit User Details Controller', function () {
    'use strict';

    var controller, route, mock;
    var createFlowSpy,
        flowNextSpy,
        locationPathSpy,
        editOperatorEditSpy,
        editOperatorCurrentOperatorSpy,
        cancelDialogServiceCreateDialogSpy;

    var invokeController, resolvePromises;

    var operator = {
        id: 2,
        firstName: 'Joanna'
    };

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    beforeEach(inject(function ($controller, $location, $rootScope, _mock_, $route, Flow, EditOperator, CancelDialogService) {
        route = $route;
        mock = _mock_;

        createFlowSpy = spyOn(Flow, 'create');
        flowNextSpy = spyOn(Flow, 'next');
        locationPathSpy = spyOn($location, 'path');
        editOperatorEditSpy = spyOn(EditOperator, 'edit').and.returnValue(mock.resolve(operator));
        editOperatorCurrentOperatorSpy = spyOn(EditOperator, 'currentOperator');
        cancelDialogServiceCreateDialogSpy = spyOn(CancelDialogService, 'createDialog').and.returnValue(mock.resolve());

        invokeController = function () {
            return $controller('EditOperatorDetailsController', {
                $route: route
            });
        };

        resolvePromises = function () {
            $rootScope.$digest();
        };

        route.current = {params: {id: '2'}};
        route.previous = {originalPath: '/start'};

    }));

    describe('Edit User Details Controller', function () {
        describe('when entering from outside the flow with a given id param', function () {
            beforeEach(function () {
                controller = invokeController();
                resolvePromises();
            });

            it('should create the flow', function () {
                expect(createFlowSpy).toHaveBeenCalledWith(['Edit details', 'Confirm details']);
            });

            it('should call the edit user with that param as an int', function () {
                expect(editOperatorEditSpy).toHaveBeenCalledWith(2);
            });

            it('should put the returned user on the controller', function () {
                expect(controller.user).toEqual(operator);
            });
        });

        describe('when going back to details from inside the flow', function () {
            var currentOperator = {id: '2'};

            beforeEach(function () {
                route.previous = {originalPath: '/account-sharing/users/:id/details'};
                route.current = {params: {id: '2'}};

                editOperatorCurrentOperatorSpy.and.returnValue(currentOperator);

                controller = invokeController();
            });

            it('should call currentOperator on EditOperator', function () {
                expect(editOperatorCurrentOperatorSpy).toHaveBeenCalled();
            });

            it('should not call edit on EditOperator', function () {
                expect(editOperatorEditSpy).not.toHaveBeenCalled();
            });

            it('should put the current operator on the controller', function () {
                expect(controller.user).toEqual(currentOperator);
            });
        });

        describe('next', function () {
            beforeEach(function () {
                controller = invokeController();
                resolvePromises();

                controller.next();
            });

            it('should call next on flow', function () {
                expect(flowNextSpy).toHaveBeenCalled();
            });

            it('should navigate to the next screen', function () {
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2/details/confirm');
            });
        });

        describe('cancel', function() {
            beforeEach(function () {
                controller = invokeController();
                resolvePromises();

                controller.cancel();
            });

            it('should call the createDialog service', function () {
                expect(cancelDialogServiceCreateDialogSpy).toHaveBeenCalled();
            });

            describe('on dialog resolved', function () {
                beforeEach(function () {
                    resolvePromises();
                });

                it('should navigate back to the user details page', function() {
                    expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2');
                });
            });
        });
    });
});