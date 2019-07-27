
describe('Account Sharing View Invitation Details', function () {
    'use strict';

    beforeEach(module('refresh.accountSharing.operatorInvitationDetails'));

    describe("routes", function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        var expectedInvitationDetails = {
            "searchInviteResponse": {
                "status": "Pending",
                "operator": {
                    "firstName": "John",
                    "lastName": "Smit",
                    "roleAssignments": [
                        {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        },
                        {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        },
                        {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        },
                        {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        },
                        {
                            "roleId": "101",
                            "description": "Create",
                            "accountRefId": "12341234"
                        }
                    ]
                },
                "businessEntity": {
                    "businessEntityID": "Flowers"
                },
                "permissions": [
                    {
                        role: {
                            id: '1',
                            name: 'View',
                            description: 'View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor.'
                        },
                        accountReference: {
                            number: '302490448'
                        }
                    },
                    {
                        role: {
                            id: '2',
                            name: 'Capturer',
                            description: 'Capture - Payments, Beneficiaries, transactions. By default, the capturer can view the items that they have captured.'
                        },
                        accountReference: {
                            number: '302490445'
                        }
                    }
                ]
            }
        };

        describe("when viewing operator invitation", function () {
            it("should the correct template", function () {
                var accountSharingOperatorInvitationDetailsRoute = route.routes['/account-sharing/invitation/:idNumber'];
                expect(accountSharingOperatorInvitationDetailsRoute.templateUrl).toEqual('features/accountSharing/manageOperator/viewOperatorInvitationDetails/operatorInvitationDetails.html');
            });

            it("should use the correct controller", function () {
                var accountSharingOperatorInvitationDetailsRoute = route.routes['/account-sharing/invitation/:idNumber'];
                expect(accountSharingOperatorInvitationDetailsRoute.controller).toEqual('OperatorInvitationDetailsController');

            });
        });

        describe("OperatorInvitationDetailsController", function () {
            var mock, rootScope, controller, operatorService, routeParams, location, addUserService, operatorInvitationService, resolvePromises;

            var invitationDetails = {
                idNumber: "12345",
                referenceNumber: "abcde",
                systemPrincipalIdentifier: {systemPrincipalId: "principalId"}
            };

            var pendingOperatorResponse = {

                "status": "Pending"
            };

            var expiredOperatorResponse = {
                "status": "OTP Expired"
            };

           var rejectedOperatorResponse = {
                 "status": "Rejected"
            };

             var escalatedOperatorResponse = {
                   "status": "Escalated"
            };

            var reinviteOperatorResponse = {
                data: {
                    "idNumber": "8001011967189",
                    "referenceNumber": "1234567891",
                    "timeToExpiry": "2 days"
                }
            };

            beforeEach(inject(function($controller, $rootScope, _mock_){
                mock = _mock_;
                rootScope = $rootScope;
                routeParams = {
                    "idNumber": "8001011967189"
                };

                resolvePromises = function () {
                    $rootScope.$digest();
                };
                operatorService = jasmine.createSpyObj('OperatorService', ['getPendingOperator', 'reInviteOperator']);
                operatorService.getPendingOperator.and.returnValue(mock.resolve(pendingOperatorResponse));
                operatorInvitationService = jasmine.createSpyObj('OperatorInvitationService', ['getDetails', 'getInvitationDetails', 'deleteInvite']);
                operatorService.reInviteOperator.and.returnValue(mock.resolve(reinviteOperatorResponse));
                location = jasmine.createSpyObj('location', ['path']);
                addUserService = jasmine.createSpyObj('AddUserService', ['setUser', 'user', 'setInviteIdentifier', 'setAccountRoles','invitation']);

            }));

            function getController() {
                var controller;

                inject(function ($controller) {
                    controller = $controller('OperatorInvitationDetailsController', {
                        OperatorService: operatorService,
                        OperatorInvitationService: operatorInvitationService,
                        $routeParams: routeParams,
                        $location: location,
                        AddUserService: addUserService
                    });

                    rootScope.$digest();
                });

                return controller;
            }

            describe('operator and permissions', function () {
                it('should fetch the operators for the current id number', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails));
                    var controller = getController();
                    expect(operatorInvitationService.getInvitationDetails).toHaveBeenCalledWith(invitationDetails);
                });

                it('should fetch the operator', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails));
                    var controller = getController();

                    expect(controller.operator).toEqual(expectedInvitationDetails);
                });
            });


            describe('invitation status', function () {
                it('should return true for a pending invitation', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));
                    var controller = getController();

                    expect(controller.isPending()).toBeTruthy();
                });

                it('should return true for an otp expired invitation', function () {
                    expectedInvitationDetails.searchInviteResponse.status = "OTP Expired";
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();

                    expect(controller.isExpired()).toBeTruthy();
                });

                it('should return true for a rejected invitation', function () {
                    expectedInvitationDetails.searchInviteResponse.status = "OTP Expired";
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();

                    expect(controller.isExpired()).toBeTruthy();
                });

                it('should return true for an escalated invitation', function () {
                    expectedInvitationDetails.searchInviteResponse.status = "Escalated";
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();

                    expect(controller.isExpired()).toBeTruthy();
                });
            });

            describe('done button', function () {
                it('should navigate back to the account sharing users list', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();

                    controller.done();
                    expect(location.path).toHaveBeenCalledWith('/account-sharing/operators/');
                });
            });

            describe('cancel button', function () {
                it('should navigate back to the account sharing users list', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));
                    var controller = getController();

                    controller.cancel();
                    expect(location.path).toHaveBeenCalledWith('/account-sharing/operators/');
                });
            });

            describe('re invite operator', function () {
                it('should navigate back to the account sharing user list', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();

                    var userDetails = {
                        "idNumber": "8001011967189"
                    };

                    var invitation = {
                        "referenceNumber": "1234567891",
                        "timeToExpiry": "2 days"
                    };

                    controller.operator.userDetails = userDetails;

                    controller.reInviteOperator();
                    rootScope.$digest();
                    expect(addUserService.entryMode).toBeDefined();
                    expect(addUserService.user).toBeDefined();
                    expect(addUserService.invitation).toHaveBeenCalledWith(invitation);
                    expect(location.path).toHaveBeenCalledWith('/account-sharing/user/finish');
                });
            });


            describe('error on reinvite operator', function () {

                beforeEach(function () {

                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    operatorService.reInviteOperator.and.returnValue(mock.reject({message: 'error message'}));

                    controller = getController();

                    var userDetails = {
                        "idNumber": "8001011967189"
                    };

                    controller.operator.userDetails = userDetails;
                    controller.operator.referenceNo = "1234500000";

                    controller.reInviteOperator();
                    rootScope.$digest();
                });

                it('should set the error message', function () {
                    expect(controller.errorMessage).toEqual('error message');
                });
            });

            describe('edit button', function () {
                it('should navigate to add user details page', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();

                    var userDetails = {
                        "idNumber": "8001011967189",
                        "firstName": "Alpha"
                    };

                    controller.operator.userDetails = userDetails;
                    controller.operator.referenceNo = "1234500000";

                    controller.editOperatorDetails();
                    expect(location.path).toHaveBeenCalledWith('/account-sharing/user/details');
                });
            });

            describe('delete button', function () {
                it('should call deleteInvite in operationInvitationService passing invitationDetails as parameter', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.deleteInvite.and.returnValue(mock.resolve({}));
                    controller.confirmDelete();
                    expect(operatorInvitationService.deleteInvite).toHaveBeenCalledWith(invitationDetails);
                });

                it('should navigate back to operator list', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.deleteInvite.and.returnValue(mock.resolve({}));
                    controller.confirmDelete();
                    resolvePromises();
                    expect(location.path).toHaveBeenCalledWith('/account-sharing/operators/');
                });

                it('should default showDeleteModal to false', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();
                    expect(controller.showDeleteModal).toBeFalsy();
                });

                it('should show modal when clicking delete', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();
                    controller.showDelete();
                    expect(controller.showDeleteModal).toBeTruthy();
                });

                it('should hide modal when clicking cancel', function () {
                    operatorInvitationService.getDetails.and.returnValue(invitationDetails);
                    operatorInvitationService.getInvitationDetails.and.returnValue(mock.resolve(expectedInvitationDetails.searchInviteResponse));

                    var controller = getController();
                    controller.showDelete();
                    expect(controller.showDeleteModal).toBeTruthy();
                    controller.cancelDelete();
                    expect(controller.showDeleteModal).toBeFalsy();
                });
            });
        });
    });
});