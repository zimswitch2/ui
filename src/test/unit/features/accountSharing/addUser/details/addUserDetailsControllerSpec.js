describe('Account Sharing Add User Details', function () {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when adding a new user', function () {
            it('should use the correct template', function () {
                var accountSharingUserDetailsRoute = route.routes['/account-sharing/user/details'];
                expect(accountSharingUserDetailsRoute.templateUrl).toEqual('features/accountSharing/manageOperator/addOperator/details/partials/addUserDetails.html');
            });

            it('should use the correct controller', function () {
                var accountSharingUserDetailsRoute = route.routes['/account-sharing/user/details'];
                expect(accountSharingUserDetailsRoute.controller).toEqual('AddUserDetailsController');
            });
        });
    });

    describe('AddUserDetailsController', function () {
        var scope, controller, flow, goHomeSpy, cancelDialogService, addUserService, operatorService, locationPathSpy, mock, rootScope, applicationParameters;

        beforeEach(inject(function ($rootScope, HomeService, Flow, $location, _mock_, ApplicationParameters) {
            mock = _mock_;
            flow = Flow;
            rootScope = $rootScope;
            applicationParameters = ApplicationParameters;
            goHomeSpy = spyOn(HomeService, 'goHome');
            locationPathSpy = spyOn($location, 'path');

            operatorService = jasmine.createSpyObj('OperatorService', ['operatorExists']);

            addUserService = jasmine.createSpyObj('AddUserService', ['user', 'reset', 'setUser','getEntryMode']);
            addUserService.user.and.returnValue({});
            controller = getController();
        }));

        function getController(promise, skipDigest) {
            var controller;
            if (!promise) {
                promise = mock.resolve();
            }

            inject(function ($rootScope, $controller, _mock_) {
                cancelDialogService = jasmine.createSpyObj('CancelDialogService', ['createDialog']);
                cancelDialogService.createDialog.and.returnValue(promise);

                scope = $rootScope.$new();

                controller = $controller('AddUserDetailsController', {
                    $scope: scope,
                    Flow: flow,
                    AddUserService: addUserService,
                    OperatorService: operatorService,
                    CancelDialogService: cancelDialogService,
                    ApplicationParameters: applicationParameters
                });

                if (!skipDigest) {
                    processPromises();
                }
            });

            return controller;
        }

        function processPromises() {
            rootScope.$digest();
        }


        describe("reset the user details ", function () {

            it("should reset when initializing the controller", function () {
                spyOn(applicationParameters, 'popVariable');
                applicationParameters.pushVariable('resetUser', true);
                applicationParameters.getVariable('resetUser');

                controller = getController();
                expect(controller.user).toEqual({});
                expect(applicationParameters.popVariable).toHaveBeenCalled();

            });
            it("should return the user when you are still within the flow", function () {
                applicationParameters.pushVariable('resetUser', false);
                applicationParameters.getVariable('');

                controller = getController();
                expect(controller.user).toEqual({});
            });

            it('should not reset user when editing an invite', function(){
                applicationParameters.pushVariable('resetUser', true);
                var entryMode = {
                    mode: 'editOperator'
                };
                addUserService.entryMode = entryMode;
                getController();
                expect(addUserService.reset).not.toHaveBeenCalled();
            });

        });

        describe('flow setup', function () {
            it('should create flow with add user steps', function () {
                expect(_.map(flow.steps(), 'name')).toEqual([ 'Enter details', 'Permissions', 'Confirm', 'Enter OTP' ]);
            });

            it('should have the flow headername set to Add user', function () {
                var entryMode = {
                    mode: "addUser",
                    "desc" : 'Add a user'
                };
                addUserService.entryMode = entryMode;
                getController();
                expect(flow.getHeaderName()).toEqual('Add a user');
            });

            it('should have the controller headername set to the flow user', function () {
                expect(controller.headerName).toEqual(flow.getHeaderName());
            });
        });

        describe('user object binding', function () {
            it('should get the user object instance from the addUserService', function () {
                expect(addUserService.user).toHaveBeenCalled();
            });
        });

        describe('next', function () {
            it('should change the location to the permissions step if operator does not exist', function () {
                operatorService.operatorExists.and.returnValue(mock.resolve(false));

                controller.next();
                processPromises();
                expect(operatorService.operatorExists).toHaveBeenCalled();
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/permissions');
            });

            it('should set error message and not change the location to the permissions step if operator exists', function () {
                operatorService.operatorExists.and.returnValue(mock.resolve(true));

                controller.next();
                processPromises();

                expect(operatorService.operatorExists).toHaveBeenCalled();
                expect(scope.errorMessage).toBeDefined();
                expect(locationPathSpy).not.toHaveBeenCalledWith('/account-sharing/user/permissions');
            });
        });

        describe('cancel', function () {
            it('should reset the user on the addUserService when promise is resolved', function () {
                var controller = getController(mock.resolve(), true);

                controller.cancel();
                processPromises();
                expect(addUserService.reset).toHaveBeenCalled();
            });

            it('should navigate back to home when cancelling and promise is resolved', function () {
                var controller = getController(mock.resolve(), true);

                controller.cancel();
                processPromises();
                expect(goHomeSpy).toHaveBeenCalled();
            });

            it('should navigate back to invitation detail when cancelling an edit and promise is resolved', function () {
                var entryMode = {
                    "mode" : "editOperator"
                };
                var user = {
                    "idNumber" : "1234567890123"
                };
                addUserService.entryMode = entryMode;
                var controller = getController(mock.resolve(), true);
                controller.user = user;

                controller.cancel();
                processPromises();
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/invitation/1234567890123');
            });
        });
    });
});
