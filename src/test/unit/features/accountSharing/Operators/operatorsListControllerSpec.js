
describe('operator widgets', function () {
    'use strict';

    var user;
    var expectedOperators = [{
                "id": 2,
                "person": {
                    "id": 3,
                    "version": 0,
                    "firstName": "Joanna 2",
                    "lastName": "Smith 2",
                    "identificationType": "RSA_ID",
                    "identification": "8001010430081",
                    "cellphoneNumber": "0820000001",
                    "bpId": "1231231234"
                },
                "delegationId": 1,
                "legalEntityId": 1,
                "version": 0
            }, {
                "id": 3,
                "person": {
                    "id": 4,
                    "version": 0,
                    "firstName": "Joanna 3",
                    "lastName": "Smith 3",
                    "identificationType": "RSA_ID",
                    "identification": "8001010430082",
                    "cellphoneNumber": "0820000001",
                    "bpId": "1231231235"
                },
                "delegationId": 1,
                "legalEntityId": 1,
                "version": 0
            }, {
                "id": 5,
                "person": {
                    "id": 6,
                    "version": 0,
                    "firstName": "Joanna 4",
                    "lastName": "Smith 4",
                    "identificationType": "RSA_ID",
                    "identification": "8001010430083",
                    "cellphoneNumber": "0820000001",
                    "bpId": "1231231236"
                },
                "delegationId": 1,
                "legalEntityId": 1,
                "version": 0
            }];

    var expectedPendingOperators = [{
        "id": 2,
        "active": false,
        "referenceNo" : "1234567890",
        "status" : "Pending",
        "userDetails": {
            "firstName": "Alpha",
            "surname": "Bravo",
            "idNumber": "8001011967187",
            "cellphoneNumber": "27729745087",
            "cellPhone": {
                "cellPhoneNumber": "0831234567",
                "countryCode": "ZA",
                "internationalDialingCode": "27"
            }
        },
        "permissions": [{
            "role": {
                "id": "1"
            },
            "accountReference": {
                "id": "5",
                "accountNumber": "302490448"
            }
        }]
    }, {
        "id": 3,
        "active": false,
        "referenceNo" : "1234567891",
        "status" : "Expired",
        "userDetails": {
            "firstName": "Charlie",
            "surname": "Delta",
            "idNumber": "8001011967189",
            "cellPhone": {
                "cellPhoneNumber": "0831234567",
                "countryCode": "ZA",
                "internationalDialingCode": "27"
            }
        },
        "permissions": [{
            "role": {
                "id": "1"
            },
            "accountReference": {
                "id": "2",
                "number": "302490448"
            }
        }]
    }, {
        "id": 5,
        "active": false,
        "referenceNo" : "1234567892",
        "status" : "Pending",
        "userDetails": {
            "firstName": "Echo",
            "surname": "Foxtrot",
            "idNumber": "8001011967188",
            "cellPhone": {
                "cellPhoneNumber": "0831234567",
                "countryCode": "ZA",
                "internationalDialingCode": "27"
            }
        },
        "permissions": [{
            "role": {
                "id": "1"
            },
            "accountReference": {
                "id": "5",
                "number": "302490448"
            }
        }]
    }];

    var systemPrincipalIdentifier = {systemPrincipalId: "principalId"};
    var locationPathSpy, addUserService, operatorInvitationService;

    beforeEach(module('refresh.accountSharing.operatorList'));
    describe("routes", function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when getting operators", function () {
            it("should use the correct template", function () {
                var operatorListRoute = route.routes['/account-sharing/operators'];
                expect(operatorListRoute.templateUrl).toEqual('features/accountSharing/manageOperator/OperatorList/operatorList.html');
            });

            it('should use the correct controller', function () {
                var operatorList = route.routes['/account-sharing/operators'];
                expect(operatorList.controller).toEqual('OperatorsController');
            });
        });
    });

    beforeEach(inject(function () {
        user = jasmine.createSpyObj('User', ['isCurrentDashboardSEDPrincipal', 'isCurrentDashboardCardHolder', 'principal']);

        user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
        user.isCurrentDashboardCardHolder.and.returnValue(true);
        user.principal.and.returnValue({systemPrincipalIdentifier: systemPrincipalIdentifier});
    }));

    function getController(operators,pendingOperators) {
        var controller;
        inject(function ($controller, $rootScope, _mock_, $location) {
            var operatorService = jasmine.createSpyObj('operatorService', ['getOperators', 'getPendingOperators']);
            operatorService.getOperators.and.returnValue(_mock_.resolve(operators));
            operatorService.getPendingOperators.and.returnValue(_mock_.resolve(pendingOperators));
            addUserService = jasmine.createSpyObj('AddUserService', ['setUser', 'user', 'setInviteIdentifier', 'setAccountRoles']);
            var pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
            locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);
            operatorInvitationService = jasmine.createSpyObj('OperatorInvitationService', ['setInvitationDetails']);
            controller = $controller('OperatorsController', {
                $location: $location,
                OperatorService: operatorService,
                OperatorInvitationService: operatorInvitationService,
                User: user,
                AddUserService: addUserService
            });

            $rootScope.$digest();
        });

        return controller;
    }

    describe("operator Status", function () {
        it("should return all the operators", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);

            expect(controller.operators).toEqual(expectedOperators);
        });

        it("should return active users", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);
            var operator = {
                "id": 2,
                "firstName": "Joanna 2",
                "lastName": "Smith 2",
                "active": true,
                "role": "Administrator",
                "account": [{"accountNo": "022456789"}],
                "$$hashKey": "02X"
            };

            expect(controller.operatorStatus(operator)).toEqual('text-notification success');
        }) ;

        it("should return inactive users", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);
            var operator = {
                "id": 2,
                "firstName": "Joanna 2",
                "lastName": "Smith 2",
                "active": false,
                "role": "Administrator",
                "account": [{"accountNo": "022456789"}],
                "$$hashKey": "02X"
            };

            expect(controller.operatorStatus(operator)).toEqual('text-notification error');
        });

        it("should return inactive users status to camelCase", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);
            var operator = {
                "id": 2,
                "firstName": "Joanna 2",
                "lastName": "Smith 2",
                "active": false,
                "role": "Administrator",
                "account": [{"accountNo": "022456789"}],
                "$$hashKey": "02X"
            };

            expect(controller.changeStatusToUpper(operator)).toEqual('Inactive');
        });
        it("should return active users status to camelCase", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);
            var operator = {
                "id": 2,
                "firstName": "Joanna 2",
                "lastName": "Smith 2",
                "active": true,
                "role": "Administrator",
                "account": [{"accountNo": "022456789"}],
                "$$hashKey": "02X"
            };

            expect(controller.changeStatusToUpper(operator)).toEqual('Active');
        });
    });

    describe("pending operators", function () {
        it("should return all pending operators", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);

            expect(controller.pendingOperators).toEqual(expectedPendingOperators);
        });
    });

    describe("add user", function(){
        it("should set entry mode", function(){
            var entryMode = {type : 'addOperator', desc : 'Add a user'};
            var controller = getController(expectedOperators, expectedPendingOperators);
            controller.addUser();
            expect(addUserService.entryMode).toEqual(entryMode);
        });

        it("should navigate to user details", function(){
            var controller = getController(expectedOperators, expectedPendingOperators);
            controller.addUser();
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/details');
        });
    });

    describe("view pending invite", function () {
        it("should set invitation details in OperatorInvitationService using operator passed as parameter and injected User", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);
            controller.viewInvitationDetails(expectedPendingOperators[0]);
            expect(operatorInvitationService.setInvitationDetails).toHaveBeenCalledWith({
                idNumber: "8001011967187",
                referenceNumber: "1234567890",
                systemPrincipalIdentifier: systemPrincipalIdentifier
            });
        });

        it("should navigate to invite details", function () {
            var controller = getController(expectedOperators, expectedPendingOperators);
            controller.viewInvitationDetails(expectedPendingOperators[0]);
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/invitation/8001011967187');
        });
    });
});
