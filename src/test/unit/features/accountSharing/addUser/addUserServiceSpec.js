describe('Account Sharing Add User Service', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    var addUserService, http, url, serviceEndpoint, mock, userService;

    beforeEach(inject(function(AddUserService, $httpBackend, URL, ServiceEndpoint, User, _mock_) {
        addUserService = AddUserService;
        http = $httpBackend;
        url = URL;
        serviceEndpoint = ServiceEndpoint;
        mock = _mock_;
        userService = User;
        spyOn(userService, 'principalForCurrentDashboard');

        addUserService.reset();
    }));

    it('should initialise an empty user', function() {
        expect(addUserService.user()).toEqual({});
    });

    it('should reset the user to an empty user object', function() {
        var user = addUserService.user();
        user.name = 'pinkie';

        expect(addUserService.user()).toEqual({
            name: 'pinkie'
        });

        addUserService.reset();
        expect(addUserService.user()).toEqual({});
    });

    it('should initialise an empty accountRoles', function() {
        expect(addUserService.accountRoles()).toEqual({});
    });

    it('should reset the roles to an empty roles object', function() {
        var accountRoles = addUserService.accountRoles();
        accountRoles['myAccount'] = {
            name: 'myAccount'
        };

        expect(addUserService.accountRoles()['myAccount']).toEqual({
            name: 'myAccount'
        });

        addUserService.reset();
        expect(addUserService.accountRoles()).toEqual({});
    });

    it('should reset the permissions to an empty permissions object', function() {
        var permissions = addUserService.permissions();
        permissions.push({
            name: 'some magical permissions'
        });

        expect(addUserService.permissions()).toEqual(permissions);

        addUserService.reset();
        expect(addUserService.permissions()).toEqual([]);
    });

    describe('create permissions', function() {
        it('should create the permissions set from the provided accounts and account-roles sets', function() {
            var account = {
                accountTypeName: 'test type',
                productName: 'test product',
                formattedNumber: '1-2-3-4',
                number: 1234
            };

            var role = {
                id: 1,
                name: 'test role',
                description: 'role description'
            };

            var accountRole = {
                '1234': 'test role'
            };

            addUserService.createPermissions([account], [role], accountRole);
            var permission = _.first(addUserService.permissions());

            var expectedAccount = {
                accountTypeName: 'test type',
                productName: 'test product',
                formattedNumber: '1-2-3-4',
                number: 1234,
            };

            expect(permission).toEqual({
                accountReference: expectedAccount,
                role: role
            });
        });

        it('should filter out none permissions from the provided sets', function() {
            var account = {
                accountTypeName: 'test type',
                productName: 'test product',
                formattedNumber: '1-2-3-4',
                number: 1234,
            };

            var role = {
                name: 'None'
            };

            var accountRole = {
                '1234': 'None'
            };

            addUserService.createPermissions([account], [role], accountRole);
            expect(addUserService.permissions()).toEqual([]);
        });
    });

    describe('permissions', function() {
        it('should return empty array', function() {
            expect(addUserService.permissions()).toEqual([]);
        });
    });

    describe('editInvitation', function(){
        var currentPrincipal;

        beforeEach(function() {
            currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: 1,
                    systemPrincipalKey: 'SED'
                }
            };
            userService.principalForCurrentDashboard.and.returnValue(currentPrincipal);
        });

        it('should call the editInvitation endpoint and return the invitation reference', function() {

            var inviteIdentifier =  {
                    idNumber: '1234500000000',
                    referenceNumber: '1234500000'
            };

            http.expectPOST(url.editOperatorInvite, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                inviteIdentifier: inviteIdentifier,
                userDetails: {
                    firstName: 'testUser'
                },
                permissions: [{
                    name: 'test'
                }]
            }).respond(200, {
                reference: '1234'
            }, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            addUserService.setInviteIdentifier(inviteIdentifier);

            var user = addUserService.user();
            user.firstName = 'testUser';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            var editInvitationPromise = addUserService.editInvitation();

            var expectedResult = {
                reference: '1234'
            };

            expect(editInvitationPromise).toBeResolvedWith(expectedResult);

            http.flush();
        });

        it('should return an error when there is an unknown error', function () {

            var inviteIdentifier =  {
                idNumber: '1234500000000',
                referenceNumber: '1234500000'
            };

            http.expectPOST(url.editOperatorInvite, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                inviteIdentifier: inviteIdentifier,
                userDetails: {
                    firstName: 'testUser'
                },
                permissions: [{
                    name: 'test'
                }]
            }).respond(500, {
                reference: '1234'
            }, {
                'x-sbg-response-code': '1234',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Some error we do not know of'
            });

            addUserService.setInviteIdentifier(inviteIdentifier);

            var user = addUserService.user();
            user.firstName = 'testUser';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            var errorMessage;
            addUserService.editInvitation()
                .catch(function (error) {
                    errorMessage = error.message;
                });
            http.flush();

            expect(errorMessage).toEqual('An error has occurred');
        });
    });

    describe('addUser', function() {
        var currentPrincipal;

        beforeEach(function() {
            currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: 1,
                    systemPrincipalKey: 'SED'
                }
            };
            userService.principalForCurrentDashboard.and.returnValue(currentPrincipal);
        });

        it('should pass user details, permissions and system principal to service endpoint', function() {
            spyOn(serviceEndpoint.addUser, 'makeRequest');

            serviceEndpoint.addUser.makeRequest.and.returnValue(mock.resolve({}));

            var user = addUserService.user();
            user.firstName = 'test';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            addUserService.addUser();

            expect(serviceEndpoint.addUser.makeRequest).toHaveBeenCalledWith({
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                userDetails: user,
                permissions: permissions
            });

        });

        it('should call the addUser endpoint and return the invitation reference', function() {
            http.expectPOST(url.addUser, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                userDetails: {
                    firstName: 'testUser'
                },
                permissions: [{
                    name: 'test'
                }]
            }).respond(200, {
                reference: '1234'
            }, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var user = addUserService.user();
            user.firstName = 'testUser';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            var addUserPromise = addUserService.addUser();

            var expectedResult = {
                reference: '1234'
            };

            expect(addUserPromise).toBeResolvedWith(expectedResult);

            http.flush();
        });

        it('should return an error when a duplicated invitation is sent', function () {
            http.expectPOST(url.addUser, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                userDetails: {
                    firstName: 'testUser'
                },
                permissions: [{
                    name: 'test'
                }]
            }).respond(200, {
                reference: '1234'
            }, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Could not send the invitation due to duplication.'
            });

            var user = addUserService.user();
            user.firstName = 'testUser';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            var errorMessage;
            addUserService.addUser()
                .catch(function (error) {
                    errorMessage = error.message;
                });
            http.flush();

            expect(errorMessage).toEqual('Could not send the invitation due to duplication.');
        });

        it('should return an error when an operator already exists', function () {
            http.expectPOST(url.addUser, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                userDetails: {
                    firstName: 'testUser'
                },
                permissions: [{
                    name: 'test'
                }]
            }).respond(200, {
                reference: '1234'
            }, {
                'x-sbg-response-code': '9001',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Operator already exists'
            });

            var user = addUserService.user();
            user.firstName = 'testUser';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            var errorMessage;
            addUserService.addUser()
                .catch(function (error) {
                    errorMessage = error.message;
                });
            http.flush();

            expect(errorMessage).toEqual('Operator already exists');
        });

        it('should return an error when there is an unknown error', function () {
            http.expectPOST(url.addUser, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                userDetails: {
                    firstName: 'testUser'
                },
                permissions: [{
                    name: 'test'
                }]
            }).respond(500, {
                reference: '1234'
            }, {
                'x-sbg-response-code': '1234',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Some error we do not know of'
            });

            var user = addUserService.user();
            user.firstName = 'testUser';
            var permissions = addUserService.permissions();
            permissions.push({
                name: 'test'
            });

            var errorMessage;
            addUserService.addUser()
                .catch(function (error) {
                    errorMessage = error.message;
                });
            http.flush();

            expect(errorMessage).toEqual('An error has occurred');
        });
    });

    describe('invitation', function() {
        it('should initially contain an empty object', function() {
            expect(addUserService.invitation()).toEqual({});
        });

        it('should return whatever is passed in to the setter', function() {
            var newInvite = {
                referenceNumber: '123abc'
            };
            addUserService.invitation(newInvite);

            expect(addUserService.invitation()).toEqual(newInvite);
        });
    });

    describe('origin url', function() {
        it('should return the origin url', function() {
            var expectedUrl = 'someplace.somedomain/someurl';
            addUserService.setFlowOrigin(expectedUrl);
            expect(addUserService.originUrl()).toEqual(expectedUrl);
        });
    });

    describe('set user', function(){
        it('should set user in addUserService', function(){
            var expectedUser = {
                "idNumber" : "9201010195183"
            };
            addUserService.setUser(expectedUser);
            expect(addUserService.user()).toEqual(expectedUser);
        });
    });

    describe('set account roles', function(){
        it('should set account roles in addUserService', function(){
            var permissions = [
                {
                    "accountReference" : {
                        "number" : "12345"
                    },
                    "role" : {
                        "name" : "view"
                    }
                }
            ];

            addUserService.setAccountRoles(permissions);
            expect(addUserService.accountRoles()["12345"]).toEqual("view");
        });
    });

    describe('send reference number details', function() {
        var currentPrincipal;

        beforeEach(function() {
            currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: 1,
                    systemPrincipalKey: 'SED'
                }
            };
            userService.principalForCurrentDashboard.and.returnValue(currentPrincipal);
        });

        it('should initially contain an empty object', function() {
            expect(addUserService.sendReferenceNumberDetails()).toEqual({});
        });

        it('should return the details it was set to', function() {
            var sendReferenceNumberDetails = addUserService.sendReferenceNumberDetails();
            sendReferenceNumberDetails.channelType = 'sms';
            sendReferenceNumberDetails.referenceNumber = '123456';
            sendReferenceNumberDetails.firstName = 'Louise';
            sendReferenceNumberDetails.lastName = 'Jackson';
            sendReferenceNumberDetails.emailAddress = 'louise@sbbb.co.za';
            sendReferenceNumberDetails.cellphoneNumber = '0734561974';

            expect(addUserService.sendReferenceNumberDetails()).toEqual({
                channelType : 'sms',
                referenceNumber : '123456',
                firstName : 'Louise',
                lastName : 'Jackson',
                emailAddress : 'louise@sbbb.co.za',
                cellphoneNumber : '0734561974'
                });
        });

        it('should reset the details to an empty object when reset is called', function() {
            var sendReferenceNumberDetails = addUserService.sendReferenceNumberDetails();
            sendReferenceNumberDetails.channelType = 'sms';
            sendReferenceNumberDetails.referenceNumber = '123456';
            sendReferenceNumberDetails.firstName = 'Louise';
            sendReferenceNumberDetails.lastName = 'Jackson';
            sendReferenceNumberDetails.emailAddress = 'louise@sbbb.co.za';
            sendReferenceNumberDetails.cellphoneNumber = '0734561974';

            expect(addUserService.sendReferenceNumberDetails()).toEqual({
                channelType : 'sms',
                referenceNumber : '123456',
                firstName : 'Louise',
                lastName : 'Jackson',
                emailAddress : 'louise@sbbb.co.za',
                cellphoneNumber : '0734561974'
            });

            addUserService.reset();

            expect(addUserService.invitation()).toEqual({});
        });

        it('should pass the details to service endpoint', function() {
            spyOn(serviceEndpoint.sendInviteReferenceNumber, 'makeRequest');

            serviceEndpoint.sendInviteReferenceNumber.makeRequest.and.returnValue(mock.resolve({}));

            var sendReferenceNumberDetails = addUserService.sendReferenceNumberDetails();
            sendReferenceNumberDetails.channelType = 'sms';
            sendReferenceNumberDetails.referenceNumber = '123456';
            sendReferenceNumberDetails.firstName = 'Louise';
            sendReferenceNumberDetails.lastName = 'Jackson';
            sendReferenceNumberDetails.emailAddress = 'louise@sbbb.co.za';
            sendReferenceNumberDetails.cellphoneNumber = '0734561974';

            addUserService.sendInviteReferenceNumber();

            expect(serviceEndpoint.sendInviteReferenceNumber.makeRequest).toHaveBeenCalledWith({
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                sendReferenceNumberDetails: sendReferenceNumberDetails
            });

        });

        it('should call the sendInviteReferenceNumber endpoint and return the response', function() {
            http.expectPOST(url.sendInviteReferenceNumber, {
                systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                sendReferenceNumberDetails:{
                   channelType : 'sms',
                   referenceNumber : '123456',
                   firstName : 'Louise',
                   lastName : 'Jackson',
                   emailAddress : 'louise@sbbb.co.za',
                   cellphoneNumber : '0734561974'
                   }
            }).respond(200, {
                successful: 'true'
            }, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var sendReferenceNumberDetails = addUserService.sendReferenceNumberDetails();
            sendReferenceNumberDetails.channelType = 'sms';
            sendReferenceNumberDetails.referenceNumber = '123456';
            sendReferenceNumberDetails.firstName = 'Louise';
            sendReferenceNumberDetails.lastName = 'Jackson';
            sendReferenceNumberDetails.emailAddress = 'louise@sbbb.co.za';
            sendReferenceNumberDetails.cellphoneNumber = '0734561974';

            var sendInviteReferenceNumberPromise = addUserService.sendInviteReferenceNumber();

            var expectedResult = {
                successful: 'true'
            };

            expect(sendInviteReferenceNumberPromise).toBeResolvedWith(expectedResult);

            http.flush();
        });
    });
});
