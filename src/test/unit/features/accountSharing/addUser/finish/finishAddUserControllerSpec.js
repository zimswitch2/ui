describe('Account Sharing Finish Add User Controller', function() {
    'use strict';

    var controller, addUserService, mockInvitation, mockUserDetails, locationPathSpy, originUrl, communicationChannels, lookUps;

    beforeEach(module('refresh.accountSharing.addUser'));

    beforeEach(inject(function($controller, $location, $rootScope) {
        addUserService = jasmine.createSpyObj('AddUserService', ['invitation', 'user', 'originUrl', 'sendReferenceNumberDetails', 'sendInviteReferenceNumber', 'reset']);
        mockInvitation = { referenceNumber: '17xenl349sb' };
        addUserService.invitation.and.returnValue(mockInvitation);
        originUrl = '/somewhere/somepage/';
        addUserService.originUrl.and.returnValue(originUrl);

        communicationChannels = [{code:'sms', description:'SMS'},{code: 'email', description:'Email'}];
        lookUps = {
            communicationChannel: {
                values: function() {
                    return communicationChannels;
                }
            }
        };

        mockUserDetails = { firstName: 'Louise', surname: 'Jackson', email: 'louise@sb.co.za', cellPhone: { cellPhoneNumber : '0721236780'} };
        addUserService.user.and.returnValue(mockUserDetails);

        addUserService.sendReferenceNumberDetails.and.returnValue({});
        addUserService.sendInviteReferenceNumber.and.returnValue(true);

        locationPathSpy = spyOn($location, 'path');

        controller = $controller('FinishAddUserController', {
            AddUserService: addUserService,
            LookUps: lookUps,
            $scope: $rootScope.$new()
        });
    }));

    it('should get the invite object from the add user service', function () {
        expect(addUserService.invitation).toHaveBeenCalled();
    });

    it ('should expose the invitation object provided by the add user service', function () {
        expect(controller.invitation).toEqual(mockInvitation);
    });

    it ('should put the user object from the add user service on the controller', function () {
        expect(controller.userDetails).toEqual(mockUserDetails);
    });

    it('should get the sendReferenceNumberDetails object from the add user service', function () {
        expect(addUserService.sendReferenceNumberDetails).toHaveBeenCalled();
    });

    describe('communication channels lookups', function(){
        it('should get lookup values from Lookups', function() {
            expect(controller.communicationChannels).toEqual(communicationChannels);
        });
    });

    describe('edit invitation',function(){

        it('should set header correctly when adding new invite', function(){
            var entryMode = {
                mode: 'addOperator'
            };
            var userDetails = {
                firstName: 'David'
            };
            addUserService.entryMode = entryMode;

            expect(controller.finishAddUserHeader(), 'New user: David');
        });

        it('should set header correctly when editing invite', function(){
            var entryMode = {
                mode: 'editOperator'
            };
            var userDetails = {
                firstName: 'David'
            };
            addUserService.entryMode = entryMode;

            expect(controller.finishAddUserHeader(), 'Edited user: David');
        });

        it('should navigate to operator list on completion ', function(){
            var entryMode = {
                mode: 'editOperator'
            };
            addUserService.entryMode = entryMode;
            controller.finishUserDetails();
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/operators');
        });

        it('should navigate to operator list on completion with sending reference number details', function(){
            var entryMode = {
                mode: 'editOperator'
            };
            addUserService.entryMode = entryMode;
            var sendReferenceNumberDetails = {
                channelType: 'none'
            };

            controller.sendReferenceNumberDetails =  sendReferenceNumberDetails;

            controller.finishUserDetails();
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/operators');
        });
    });

    describe('Finish', function(){
        it ('should reset the state data when the process is completed without sending reference number', function () {
            controller.sendReferenceNumberDetails.channelType = 'none';
            controller.finishUserDetails();

            expect(addUserService.reset).toHaveBeenCalled();
        });

        it ('should reset the state data when the process is completed after sending reference number', function () {
            controller.sendReferenceNumberDetails.channelType = 'sms';
            controller.finishUserDetails();

            expect(addUserService.reset).toHaveBeenCalled();
        });

        it ('should change the location back to the add user entry point screen when not sending invite reference number', function () {
            controller.sendReferenceNumberDetails.channelType = 'none';
            controller.finishUserDetails();

            expect(locationPathSpy).toHaveBeenCalledWith(originUrl);
        });

       it ('should change the location back to the add user entry point screen after sending invite reference number', function () {
            controller.sendReferenceNumberDetails.channelType = 'sms';
            controller.finishUserDetails();

            expect(locationPathSpy).toHaveBeenCalledWith(originUrl);
        });

        it ('should not call sendInviteReferenceNumber when not sending invite reference number', function () {
            controller.sendReferenceNumberDetails.channelType = 'none';
            controller.finishUserDetails();

            expect(addUserService.sendInviteReferenceNumber).not.toHaveBeenCalled();
        });

        it ('should call sendInviteReferenceNumber when sending invite reference number via email', function () {
            controller.sendReferenceNumberDetails.channelType = 'email';
            controller.finishUserDetails();

            expect(addUserService.sendInviteReferenceNumber).toHaveBeenCalled();
        });

        it ('should call sendInviteReferenceNumber when sending invite reference number via sms', function () {
            controller.sendReferenceNumberDetails.channelType = 'sms';
            controller.finishUserDetails();

            expect(addUserService.sendInviteReferenceNumber).toHaveBeenCalled();
        });

        it ('should set the details to the user details when sending invite reference number via email', function () {
            controller.sendReferenceNumberDetails.channelType = 'email';
            controller.finishUserDetails();

            expect(controller.sendReferenceNumberDetails.channelType).toEqual(controller.sendReferenceNumberDetails.channelType);
            expect(controller.sendReferenceNumberDetails.referenceNumber).toEqual(mockInvitation.referenceNumber);
            expect(controller.sendReferenceNumberDetails.firstName).toEqual(mockUserDetails.firstName);
            expect(controller.sendReferenceNumberDetails.lastName).toEqual(mockUserDetails.surname);
            expect(controller.sendReferenceNumberDetails.emailAddress).toEqual(mockUserDetails.email);
            expect(controller.sendReferenceNumberDetails.cellphoneNumber).toEqual(mockUserDetails.cellPhone.cellPhoneNumber);
        });

        it ('should set the details to the user details when sending invite reference number via sms', function () {
            controller.sendReferenceNumberDetails.channelType = 'sms';
            controller.finishUserDetails();

            expect(controller.sendReferenceNumberDetails.channelType).toEqual(controller.sendReferenceNumberDetails.channelType);
            expect(controller.sendReferenceNumberDetails.referenceNumber).toEqual(mockInvitation.referenceNumber);
            expect(controller.sendReferenceNumberDetails.firstName).toEqual(mockUserDetails.firstName);
            expect(controller.sendReferenceNumberDetails.lastName).toEqual(mockUserDetails.surname);
            expect(controller.sendReferenceNumberDetails.emailAddress).toEqual(mockUserDetails.email);
            expect(controller.sendReferenceNumberDetails.cellphoneNumber).toEqual(mockUserDetails.cellPhone.cellPhoneNumber);
        });

        it("should call showFlowHeader",function() {
            expect(controller.showFlowHeader(), true);
        });

        it("should  display flow header in edit mode", function(){
            var entryMode = {
                mode: 'editOperator'
            };
            addUserService.entryMode = entryMode;
            controller.finishUserDetails();
            expect(controller.showFlowHeader(),true);
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/operators');

        });

        it("should not display flow header reinvite mode", function(){
            var entryMode = {
                mode: 'reinviteOperator'
            };
            addUserService.entryMode = entryMode;
            controller.finishUserDetails();
            expect(controller.showFlowHeader(),false);
            expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/operators');
        });

    });
});
