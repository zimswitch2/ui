describe('Invitation widget', function () {

    'use strict';

    var inviteOperatorMenuService;

    var routeProvider;
    beforeEach(module('refresh.accountSharing.inviteOperator', function ($routeProvider) {
        routeProvider = $routeProvider;

    }));
    describe("routes", function () {
        var route, invitationMenuService, rootScope, location;
        beforeEach(inject(function ($route, $location, InvitationMenuService, $rootScope) {
            route = $route;
            rootScope = $rootScope;
            location = $location;
            invitationMenuService = InvitationMenuService;
            spyOn(invitationMenuService, 'resetShowMenu');
        }));

        describe("when getting operators", function () {
            it("should use the correct template", function () {
                var operatorListRoute = route.routes['/account-sharing/invitation-details'];
                expect(operatorListRoute.templateUrl).toEqual('features/accountSharing/manageOperator/inviteOperator/invitationDetails/partials/invitationDetails.html');
            });

            it('should use the correct controller', function () {
                var operatorList = route.routes['/account-sharing/invitation-details'];
                expect(operatorList.controller).toEqual('InviteOperatorController');
            });
        });
        describe("route", function () {
            beforeEach(function () {
                routeProvider.when('/account-sharing/invitation-details', {});
                routeProvider.when('/account-sharing/accept-decline-invitation', {});
                routeProvider.when('/anywhere-else', {});
                routeProvider.when('/', {});

                route.current = {};

            });

            describe('navigating from the invitation details page', function () {
                beforeEach(function () {
                    location.path('/account-sharing/invitation-details');
                    rootScope.$digest();
                });

                it("should show the menu when navigating out of the invitation flow", function () {
                    location.path('/');
                    rootScope.$digest();

                    expect(invitationMenuService.resetShowMenu).toHaveBeenCalled();
                });

                it('should not show the menu when navigating to the next step in the process', function () {
                    location.path('/account-sharing/accept-decline-invitation');
                    rootScope.$digest();

                    expect(invitationMenuService.resetShowMenu).not.toHaveBeenCalled();
                });
            });

            describe('navigating from anywhere else', function () {
                beforeEach(function () {
                    location.path('/anywhere-else');
                    rootScope.$digest();
                });

                it('should not show the menu when navigating to any other route', function () {
                    location.path('/account-sharing/accept-decline-invitation');
                    rootScope.$digest();

                    expect(invitationMenuService.resetShowMenu).not.toHaveBeenCalled();
                });

                it('should not show the menu when navigating to any other route', function () {
                    location.path('/');
                    rootScope.$digest();

                    expect(invitationMenuService.resetShowMenu).not.toHaveBeenCalled();
                });
            });


        });

    });

    describe("InviteOperatorController", function () {
        var flow, controller, rootScope, locationPathSpy, mock, operatorInvitationService, applicationParameters, scope;

        beforeEach(inject(function ($rootScope, Flow, $location, _mock_, ApplicationParameters) {
            flow = Flow;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            locationPathSpy = spyOn($location, 'path');
            mock = _mock_;
            applicationParameters = ApplicationParameters;

            inviteOperatorMenuService = jasmine.createSpyObj('InvitationMenuService', ['setShowMenu', 'resetShowMenu']);
            operatorInvitationService = jasmine.createSpyObj('OperatorInvitationService', ['searchInvite', 'invitationDetails', 'reset', 'setInvitationDetails']);


            var expectedResponse = {
                "searchInviteResponse": {
                    "operator": {
                        "firstName": "John",
                        "lastName": "Smit",
                        "roleAssignments": [{
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }, {"roleId": "101", "description": "Create", "accountRefId": "12341234"}, {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }, {"roleId": "101", "description": "Create", "accountRefId": "12341234"}, {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }]
                    }, "businessEntity": {"businessEntityID": "Flowers"}
                }
            };
            operatorInvitationService.searchInvite.and.returnValue(mock.resolve(expectedResponse));

            controller = getController();
        }));

        function getController(response, promise) {
            if (!promise) {
                promise = mock.resolve();
            }
            inject(function ($controller) {


                controller = $controller('InviteOperatorController', {
                    InvitationMenuService: inviteOperatorMenuService,
                    Flow: flow,
                    OperatorInvitationService: operatorInvitationService,
                    ApplicationParameters: applicationParameters,
                    $scope: scope

                });

                rootScope.$digest();
            });

            return controller;
        }

        function processPromises() {
            rootScope.$digest();
        }

        describe('flow setup', function () {
            it('should create flow with add user steps', function () {
                expect(_.map(flow.steps(), 'name')).toEqual(['Enter details', 'Accept / Decline', 'Enter OTP']);
            });

            it('should have the flow headername set to Add user', function () {
                expect(flow.getHeaderName()).toEqual('Accept / Decline Invitation');
            });

            it('should have the controller headername set to the flow user', function () {
                expect(controller.headerName).toEqual(flow.getHeaderName());
            });
        });

        describe("get view to display", function () {

            it("should return getStarted when there are no active users", function () {
                inviteOperatorMenuService.setShowMenu.and.returnValue(false);
                var controller = getController(false);

                expect(controller.showMenu).toBeFalsy();

            });

        });

        describe('next', function () {

            beforeEach(function () {
                var controller = getController();

                controller.next();
                processPromises();

            });


            it("should return invitation details", function () {
                var invitationDetails =
                {
                    "operator": {
                        "firstName": "John",
                        "lastName": "Smit",
                        "roleAssignments": [{
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }, {"roleId": "101", "description": "Create", "accountRefId": "12341234"}, {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }, {"roleId": "101", "description": "Create", "accountRefId": "12341234"}, {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }]
                    }, "businessEntity": {"businessEntityID": "Flowers"}
                };

                expect(controller.invitationDetails).toEqual(invitationDetails);
            });

            it('should show the modal when the search is successful', function () {
                expect(controller.showModal).toBeTruthy();
            });
            it('should show the modal when the search is successful', function () {
                var invitationDetails =
                {
                    "operator": {
                        "firstName": "John",
                        "lastName": "Smit",
                        "roleAssignments": [{
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }, {"roleId": "101", "description": "Create", "accountRefId": "12341234"}, {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }, {"roleId": "101", "description": "Create", "accountRefId": "12341234"}, {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }]
                    }, "businessEntity": {"businessEntityID": "Flowers"}
                };

                expect(operatorInvitationService.setInvitationDetails).toHaveBeenCalledWith(invitationDetails);
            });


        });
        it("should return an error you get an empty response", function () {
            var error = {"message": "Invitation not found"};


            operatorInvitationService.searchInvite.and.returnValue(mock.reject(error));
            var controller = getController();

            controller.next();
            processPromises();

            expect(scope.errorMessage).toEqual("Invitation not found");
        });

        describe('cancel', function () {
            it("should show menu when canceling the process", function () {
                inviteOperatorMenuService.resetShowMenu.and.returnValue(true);
                var controller = getController(true);

                controller.cancel();

                expect(controller.showMenu).toBeTruthy();
                expect(operatorInvitationService.reset).toHaveBeenCalled();
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/operators');
            });
        });

        describe('redirection', function () {
            it('should redirect to login page when you are an existing user', function () {
                var controller = getController(false);
                spyOn(applicationParameters, 'pushVariable');

                controller.redirectToSignIn();

                expect(controller.showModal).toBeFalsy();
                expect(locationPathSpy).toHaveBeenCalledWith('/login');
                expect(applicationParameters.pushVariable).toHaveBeenCalledWith('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');

            });

            it('should redirect to register when you are new to bank', function () {
                var controller = getController(false);

                controller.redirectToRegister();

                expect(controller.showModal).toBeFalsy();
                expect(locationPathSpy).toHaveBeenCalledWith('/register');
            });
        });
    });

});

