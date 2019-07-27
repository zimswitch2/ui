describe('Account Sharing Widget', function() {
    'use strict';

    var user, operatorService, locationPathSpy;
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

    beforeEach(module('refresh.accountSharing'));

    beforeEach(inject(function() {
        user = jasmine.createSpyObj('User', ['isCurrentDashboardSEDPrincipal', 'isCurrentDashboardCardHolder']);

        user.isCurrentDashboardSEDPrincipal.and.returnValue(true);
    }));

    function getController(operators) {
        var controller;

        inject(function($controller, $rootScope, _mock_, $location) {
            operatorService = jasmine.createSpyObj('operatorService', ['getOperators', ['getPendingOperators']]);
            operatorService = jasmine.createSpyObj('operatorService', ['getOperators', 'getPendingOperators']);
            operatorService.getOperators.and.returnValue(_mock_.resolve(operators));
            operatorService.getPendingOperators.and.returnValue(_mock_.resolve(operators));

            controller = $controller('AccountSharingWidgetController', {
                OperatorService: operatorService,
                User: user
            });

            var pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
            locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);

            $rootScope.$digest();
        });

        return controller;
    }

    describe('load operators', function() {
        it('should only load operators if the current dashboard has an SED principal', function() {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(false);
            var controller = getController();

            expect(controller.numberOfOperators).toEqual(undefined);
            expect(operatorService.getOperators).not.toHaveBeenCalled();
        });
    });

    describe("get view to display", function() {
        it("should return viewUsers when you have active users", function() {
            var controller = getController(expectedOperators);

            expect(controller.viewName()).toEqual("viewUsers");
        });

        it("should return getStarted when there are no active users", function() {
            var controller = getController({ data: { operators: [] }});

            expect(controller.viewName()).toEqual("getStarted");
        });

        it("should return register when current user has no SED principal", function() {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(false);
            var controller = getController(expectedOperators);

            expect(controller.viewName()).toEqual("register");
        });

        it("should return register when only businessAccounts Exist", function() {
            user.isCurrentDashboardSEDPrincipal.and.returnValue(false);
            var controller = getController({ data: { operators: [] }});

            expect(controller.viewName()).toEqual("register");
        });
    });

    describe("Add user button click", function(){
        it('should navigate to user detail page', function(){
            var controller = getController(expectedOperators);
            controller.addUser();
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/details');
        });
    });
});
