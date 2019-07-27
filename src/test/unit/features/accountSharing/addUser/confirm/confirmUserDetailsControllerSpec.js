describe('Account Sharing Confirm User Details Controller', function () {
    'use strict';

    var controller, addUserService, rootScope, flow, scope;
    var locationPathSpy, pathSpy, cancelDialogServiceCreateDialogSpy, goHomeSpy;
    var mockUser, mockInvitation, mockPermissions, applicationParameters, mockEntryMode;

    mockInvitation = {
        referenceNumber: '123abc'
    };

    beforeEach(module('refresh.accountSharing.addUser'));

    beforeEach(inject(function ($controller, $location, $rootScope, mock, CancelDialogService, HomeService, ApplicationParameters) {
        cancelDialogServiceCreateDialogSpy = spyOn(CancelDialogService, 'createDialog').and.returnValue(mock.resolve());
        goHomeSpy = spyOn(HomeService, 'goHome');

        addUserService = jasmine.createSpyObj('AddUserService', ['addUser', 'user', 'invitation', 'permissions', 'reset', 'entryMode', 'editInvitation']);
        addUserService.addUser.and.returnValue(mock.resolve(mockInvitation));
        addUserService.editInvitation.and.returnValue(mock.resolve(mockInvitation));

        applicationParameters = ApplicationParameters;

        mockUser = {
            firstName: 'Test',
            surname: 'User'
        };

        addUserService.user.and.returnValue(mockUser);

        mockPermissions = [{
            account: {
                id: 1
            },
            role: {
                id: 1
            }
        }];

        addUserService.permissions.and.returnValue(mockPermissions);

        mockEntryMode = {
            "mode" : "editOperator",
            "desc" : "Edit user"
        };
        addUserService.entryMode = mockEntryMode;

        flow = jasmine.createSpyObj('flow', ['next', 'previous']);
        pathSpy = jasmine.createSpyObj('pathSpy', ['replace']);
        locationPathSpy = spyOn($location, 'path').and.returnValue(pathSpy);
        rootScope = $rootScope;

        scope = $rootScope.$new();

        controller = $controller('ConfirmUserDetailsController', {
            $scope: scope,
            AddUserService: addUserService,
            Flow: flow,
            ApplicationParameters: applicationParameters
        });
    }));

    it('should put the user details from the AddUserService onto the view model', function () {
        expect(controller.userDetails).toEqual(mockUser);
    });

    it('should display correct header for add user', function(){
        addUserService.entryMode = undefined;
        expect(controller.entryModeDesc(), 'Add a user');
    });

    it('should display correct header for edit invite', function(){
        addUserService.entryMode = {
            desc: 'Edit user'
        };
        expect(controller.entryModeDesc(), 'Edit user');
    });

    it('should put the user details from the AddUserService onto the view model', function () {
        expect(controller.permissions).toEqual(mockPermissions);
    });

    describe('cancel', function() {
        beforeEach(function () {
            controller.cancel();
        });

        it('should call the createDialog service', function () {
            expect(cancelDialogServiceCreateDialogSpy).toHaveBeenCalled();
        });

        describe('on dialog resolved', function () {
            beforeEach(function () {
                rootScope.$digest();
            });

            it('should reset the user object when the dialog is confirmed', function() {
                expect(addUserService.reset).toHaveBeenCalled();
            });

             it('should go home when the dialog is confirmed', function() {
                expect(goHomeSpy).toHaveBeenCalled();
            });
        });
    });

    describe('Edit user details', function () {

        beforeEach(function () {
            controller.editUserDetails();
            rootScope.$digest();
        });

        it('should change location to edit details screen', function () {
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/details');
        });

        it('should call replace on the path', function () {
            expect(pathSpy.replace).toHaveBeenCalledWith();
        });

        it('should update the flow', function () {
            expect(flow.previous).toHaveBeenCalled();
            expect(flow.previous.calls.count()).toEqual(2);
        });
    });

    describe('Edit user permissions', function () {

        beforeEach(function () {
            controller.editPermissions();
            rootScope.$digest();
        });

        it('should change location to edit permissions screen', function () {
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/permissions');
        });

        it('should call replace on the path', function () {
            expect(pathSpy.replace).toHaveBeenCalledWith();
        });

        it('should update the flow', function () {
            expect(flow.previous).toHaveBeenCalled();
            expect(flow.previous.calls.count()).toEqual(1);
        });
    });

    describe('Confirm', function () {
        beforeEach(function () {
            addUserService.entryMode = {};
            controller.confirmUserDetails();
            rootScope.$digest();
        });

        it('should call the add user service', function () {
            expect(addUserService.addUser).toHaveBeenCalled();
        });

        it('should change the location to the finish step', function () {
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/finish');
        });

        it('should call replace on the path', function () {
            expect(pathSpy.replace).toHaveBeenCalledWith();
        });

        it('should pass the result invitation back to the add user service', function () {
            expect(addUserService.invitation).toHaveBeenCalledWith(mockInvitation);
        });

        it('should call next on flow', function () {
            expect(flow.next).toHaveBeenCalled();
        });

    });

    describe('Confirm Edit Invitation', function () {
        beforeEach(function () {
            addUserService.entryMode = {mode : 'editOperator', desc : 'Edit invitation'};
            controller.confirmUserDetails();
            rootScope.$digest();
        });

        it('should call the editInvitation on add user service', function () {
            expect(addUserService.editInvitation).toHaveBeenCalled();
        });

        it('should change the location to the finish step', function () {
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/user/finish');
        });

        it('should call replace on the path', function () {
            expect(pathSpy.replace).toHaveBeenCalledWith();
        });

        it('should pass the result invitation back to the add user service', function () {
            expect(addUserService.invitation).toHaveBeenCalledWith(mockInvitation);
        });

        it('should call next on flow', function () {
            expect(flow.next).toHaveBeenCalled();
        });

    });

    it("should return an error when a duplicated invite is sent", inject(function (_mock_) {
        spyOn(applicationParameters, 'pushVariable');
        var error = {"message": "Could not send the invitation due to duplication."};
        var mock = _mock_;

        addUserService.addUser.and.returnValue(mock.reject(error));
        addUserService.entryMode = {};

        controller.confirmUserDetails();
        rootScope.$digest();

        expect(applicationParameters.pushVariable).toHaveBeenCalled();
        expect(controller.errorMessage).toEqual('Could not send the invitation due to duplication.');
    }));


    it("should push a variable when confirming an operator", function () {
        spyOn(applicationParameters, 'pushVariable');
        addUserService.entryMode = {};

        controller.confirmUserDetails();
        rootScope.$digest();

        expect(applicationParameters.pushVariable).toHaveBeenCalled();
    });
});
