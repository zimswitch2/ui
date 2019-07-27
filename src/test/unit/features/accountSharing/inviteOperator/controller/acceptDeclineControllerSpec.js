describe('Invitation widget', function () {

    'use strict';

    var inviteOperatorMenuService;
    var expectedResponse = false;

    var routeProvider;
    beforeEach(module('refresh.accountSharing.inviteOperator', function ($routeProvider) {
        routeProvider = $routeProvider;

    }));
    describe("routes", function () {
        var route, invitationMenuService, rootScope, location;
        beforeEach(inject(function ($route, $location, $rootScope) {
            route = $route;
            rootScope = $rootScope;
            location = $location;
        }));

        describe("when getting operators", function () {
            it("should use the correct template", function () {
                var operatorListRoute = route.routes['/account-sharing/accept-decline-invitation'];
                expect(operatorListRoute.templateUrl).toEqual('features/accountSharing/manageOperator/inviteOperator/acceptDeclineInvitations/partials/declineinvitation.html');
            });

            it('should use the correct controller', function () {
                var operatorList = route.routes['/account-sharing/accept-decline-invitation'];
                expect(operatorList.controller).toEqual('AcceptDeclineInvitationController');
            });
        });
    });

    describe("AcceptDeclineInvitationController", function () {
        var flow, controller, rootScope, locationPathSpy, mock, authService, operatorInvitationService, user;
        var flowNextSpy,
            userAddDashboardSpy,
            userSwitchDashboardSpy,
            userFindDashboardByProfileId,
            applicationParametersPushVariableSpy;
        var mockInvitationDetails,
            popVariable;
        beforeEach(inject(function ($rootScope, Flow, $location, _mock_, AuthenticationService, User, ApplicationParameters) {
            flow = Flow;
            flowNextSpy = spyOn(flow, 'next');
            rootScope = $rootScope;
            locationPathSpy = spyOn($location, 'path');
            mock = _mock_;
            user = User;
            applicationParametersPushVariableSpy = spyOn(ApplicationParameters, 'pushVariable');
            popVariable = spyOn(ApplicationParameters, 'popVariable');

            userAddDashboardSpy = spyOn(User, 'addDashboard').and.returnValue({});
            userSwitchDashboardSpy = spyOn(User, 'switchToDashboard');
            userFindDashboardByProfileId = spyOn(User, 'findDashboardByProfileId');

            inviteOperatorMenuService = jasmine.createSpyObj('InvitationMenuService', ['setShowMenu', 'resetShowMenu']);
            operatorInvitationService = jasmine.createSpyObj('OperatorInvitationService', ['getDetails', 'declineInvite', 'acceptInvite', 'reset']);
            authService = jasmine.createSpyObj('AuthenticationService', ['logout']);

            mockInvitationDetails = {
                "userDetails": {
                    "firstName": "John",
                    "surname": "Smith",
                    "idNumber": "0101014652193",
                    "referenceNumber":"23456"
                },
                "permissions": [{
                    "role": {
                        "id": "1",
                        "name": "view",
                        "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                    }, "account": {"id": 1, "type": "CURRENT", "number": "2235145"}
                }, {
                    "role": {
                        "id": "2",
                        "name": "capturer",
                        "description": "Capturer - can capture all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                    }, "account": {"id": 2, "type": "CREDIT", "number": "2235146"}
                }],
                "business": {"id": "1", "name": "Flowers"}
            };

            operatorInvitationService.getDetails.and.returnValue(mockInvitationDetails);

            controller = getController();
        }));

        function getController(response, promise) {
            if (!promise) {
                promise = mock.resolve();
            }
            inject(function ($controller) {


                controller = $controller('AcceptDeclineInvitationController', {
                    InvitationMenuService: inviteOperatorMenuService,
                    Flow: flow,
                    OperatorInvitationService: operatorInvitationService,
                    AuthenticationService: authService,
                    User: user
                });

                rootScope.$digest();
            });

            return controller;
        }

        function processPromises() {
            rootScope.$digest();
        }

        it('should hide the menu options', function () {
            inviteOperatorMenuService.setShowMenu.and.returnValue(false);
            var controller = getController(false);

            expect(controller.showMenu).toBeFalsy();
        });

        it('should get the invitation details', function () {
            var controller = getController(false);
            expect(controller.invitationDetails).toEqual(mockInvitationDetails);
        });


        it('should show the modal when declining the invitation ', function () {
            var controller = getController(false);

            controller.declineInvitation();

            expect(controller.showModal).toBeTruthy();
        });


        it('should logout the user if the choose to decline the invitation', function () {
            var expectedResponse = {
                "userDetails": {
                    "firstName": "John",
                    "surname": "Smith",
                    "idNumber": "0101014652193",
                    "referenceNumber":"23456"
                },
                "permissions": [{
                    "role": {
                        "id": "1",
                        "name": "view",
                        "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                    }, "account": {"id": 1, "type": "CURRENT", "number": "2235145"}
                }, {
                    "role": {
                        "id": "2",
                        "name": "capturer",
                        "description": "Capturer - can capture all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                    }, "account": {"id": 2, "type": "CREDIT", "number": "2235146"}
                }],
                "business": {"id": "1", "name": "Flowers"}
            };
            operatorInvitationService.getDetails.and.returnValue(expectedResponse);
            var invitation = {
                "idNumber": "0101014652193",
                "referenceNumber":"23456",
            };
            var controller = getController(false);
            controller.declineInvitationOnModal();



            expect(authService.logout).toHaveBeenCalled();
            expect(operatorInvitationService.declineInvite).toHaveBeenCalledWith(invitation);
            expect(operatorInvitationService.reset).toHaveBeenCalled();
        });


        it("should go back to the details page", function(){
            var controller = getController(false);

            controller.goBackToDetails();

            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/accept-decline-invitation');
            expect(controller.showModal).toBeFalsy();

        });

        describe ('acceptInvitation', function () {
            var controller;

            var acceptInvitationResponse = {
                channelProfile: {
                    "image": "",
                        "tileViews": [],
                        "profileId": "7777778",
                        "profileName": "New SED Profile",
                        "profileStyle": "BUSINESS",
                        "systemPrincipalIdentifiers": [
                        {
                            "locale": null,
                            "systemPrincipalId": "7777778",
                            "systemPrincipalKey": "SED"
                        }
                    ]
                },
                card: { cardNumber: "5221346360070105" }
            };

            beforeEach(function () {
                operatorInvitationService.acceptInvite.and.returnValue(mock.resolve(acceptInvitationResponse));
                userFindDashboardByProfileId.and.returnValue(acceptInvitationResponse.channelProfile);
                controller = getController();
                controller.acceptInvitation();
            });

            it( "should call next on flow", function () {
                expect(flowNextSpy).toHaveBeenCalled();
            });

            it ('should call operator invitation service with the correct invite details', function () {
                expect(operatorInvitationService.acceptInvite).toHaveBeenCalledWith({
                    idNumber: "0101014652193",
                    referenceNumber: "23456",
                });
            });

            describe('when decline invite resolves successfully', function () {
                beforeEach(function () {
                    processPromises();
                });

                it ("should pass the profile and card from the response to user.addDashboard", function () {
                    var expectedResult = acceptInvitationResponse.channelProfile;
                    expectedResult.card = acceptInvitationResponse.card.cardNumber;

                    expect(userAddDashboardSpy).toHaveBeenCalledWith(expectedResult);
                });


                it('should switch to the new profile', function () {
                    expect(userSwitchDashboardSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                        profileId: '7777778'
                    }));
                });

                it ('should set custom welcome message', function () {
                    expect(applicationParametersPushVariableSpy).toHaveBeenCalledWith('customMessage', 'Welcome John, your account has been activated. You can now access Flowers Accounts');
                });
                it ('should pop the invitation variable', function () {



                    expect(popVariable).toHaveBeenCalledWith('acceptInvitationRedirect');
                });

                it('navigate to account-summary', function () {
                    expect(locationPathSpy).toHaveBeenCalledWith('/account-summary');
                });
            });
        });
    });
});

