describe('OperatorInvitationService', function () {
    'use strict';
    beforeEach(module(
        'refresh.accountSharing.inviteOperator',
        'refresh.accountSharing.operator'));

    var http, url, operatorInvitationService, invitation, serviceError, accountListSpy, cardSpy, user, mock;
    var currentSystemPrincipalIdentifiers = {
        "systemPrincipalIdentifiers": {
            "systemPrincipalId": "123132",
            "systemPrincipalKey": "SED"
        }
    };

    invitation = {
        "idNumber": "0101014652204",
        "referenceNumber": "12345"
    };

    var expectedResponse = {
        "searchInviteResponse": {
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
                    "role": {
                        "id": "1",
                        "name": "View",
                        "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                    },
                    "accountReference": {
                        "id": 1,
                        "type": "CURRENT",
                        "number": "302490448"
                    }
                },
                {
                    "role": {
                        "id": "2",
                        "name": "Capturer",
                        "description": "Capturer - can capture all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                    },
                    "accountReference": {
                        "id": 2,
                        "type": "CREDIT",
                        "number": "302490445"
                    }
                }
            ]
        }
    };

    var expectedInvitationDetails = {
        "searchInviteResponse": {
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

    var rolesResponse = {
        "roles": [{
            "id": "1",
            "name": "View",
            "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
        }, {
            "id": "2",
            "name": "Capturer",
            "description": "Capture - Payments, Beneficiaries, transactions. By default, the capturer can view the items that they have captured."
        }, {
            "id": "3",
            "name": "Authoriser",
            "description": "Authorise - Authorise all transactions as defined in the workflow. This role cannot capture/release. By default, the authoriser can view the items that they have authorised."
        }]
    };

    beforeEach(inject(function (OperatorInvitationService, _$httpBackend_, _URL_, _ServiceError_, AccountsService, OperatorService, Card, _User_, _mock_) {
        operatorInvitationService = OperatorInvitationService;
        http = _$httpBackend_;
        url = _URL_;
        serviceError = _ServiceError_;
        user = _User_;
        mock = _mock_;

        cardSpy = spyOn(Card, ['current']);
        accountListSpy = spyOn(AccountsService, 'list');

        cardSpy.and.returnValue({
            number: 'number'
        });

        accountListSpy.and.returnValue(mock.resolve({
            accounts: [{
                number: "302490448"
            },{
                number: "302490445"
            }]
        }));

        spyOn(user, 'principal').and.returnValue(currentSystemPrincipalIdentifiers);
        spyOn(user, 'principalForCurrentDashboard');

        operatorInvitationService.reset();

    }));

    it('should initialise an empty invitation', function () {
        expect(operatorInvitationService.getDetails()).toEqual({});
    });

    it('should reset the invitation to an empty invitation object', function () {
        var invitation = operatorInvitationService.setInvitationDetails(expectedResponse);

        expect(operatorInvitationService.getDetails()).toEqual({
            "searchInviteResponse": {
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
                            id: 1,
                            type: 'CURRENT',
                            number: '302490448'
                        }
                    },
                    {
                        role: {
                            id: '2',
                            name: 'Capturer',
                            description: 'Capturer - can capture all transactions on the entity. This role would typically be assigned to the accountant or the auditor.'
                        },
                        accountReference: {
                            id: 2,
                            type: 'CREDIT',
                            number: '302490445'
                        }
                    }
                ]
            }
        });

        operatorInvitationService.reset();
        expect(operatorInvitationService.getDetails()).toEqual({});
    });


    describe('invitation details', function () {
        it('should contain  an idNumber and reference provided to the payload then get the response', function () {
            http.expectPOST(url.searchOperatorInvite, invitation).respond(200, expectedResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var responseData;

            operatorInvitationService.getInvitationDetails(invitation)
                .then(function (response) {
                    responseData = response;
                });

            http.flush();

            expect(responseData).toEqual(expectedInvitationDetails.searchInviteResponse);
        });

        it('should contain the an idNumber and reference provided to the payload then get an empty response when the invitation is not found ', function () {
            http.expectPOST(url.searchOperatorInvite, invitation).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });


            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var errorMessage;

            operatorInvitationService.getInvitationDetails(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('Invitation not found');
        });

        it('should lock the invitation when user tries a combination 3 times', function () {
            http.expectPOST(url.searchOperatorInvite, invitation).respond(200, {}, {
                'x-sbg-response-code': '9001',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'The invitation has been locked. Please contact the person who initiated the invite to reset the invite.'
            });

            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var errorMessage;

            operatorInvitationService.getInvitationDetails(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('The invitation has been locked. Please contact the person who initiated the invite to reset the invite.');
        });

        it('should return an error when an unknown error occurs ', function () {
            http.expectPOST(url.searchOperatorInvite, invitation).respond(200, {}, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'An error occurred.'
            });

            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var errorMessage;

            operatorInvitationService.getInvitationDetails(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error occurred.');
        });

        it('should return an undefined error message on a 500 response', function () {
            http.expectPOST(url.searchOperatorInvite).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var errorMessage;

            operatorInvitationService.getInvitationDetails(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error has occurred');
        });
    });

    describe("declining an invitation", function () {

        it('should contain  an idNumber and reference provided to the payload then get the response', function () {
            http.expectPOST(url.declineInvitation, invitation).respond(200, {},
                {
                    'x-sbg-response-code': '0000',
                    'x-sbg-response-type': 'SUCCESS'
                });

            var responseData;

            operatorInvitationService.declineInvite(invitation)
                .then(function (response) {
                    responseData = response;
                });

            http.flush();

            expect(responseData).toEqual({});
        });

        it('should return an undefined error message on a 500 response', function () {
            http.expectPOST(url.declineInvitation).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;

            operatorInvitationService.declineInvite(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error has occurred');
        });
    });

    describe("accepting an invitation", function () {

        it('should contain  an idNumber and reference provided to the payload then get the response', function () {
            var mockResponse = { channelProfile: {}, card: "12345"};

            http.expectPOST(url.acceptInvitation, invitation).respond(200, mockResponse,
                {
                    'x-sbg-response-code': '0000',
                    'x-sbg-response-type': 'SUCCESS'
                });

            var responseData;

            operatorInvitationService.acceptInvite(invitation)
                .then(function (response) {
                    responseData = response;
                });

            http.flush();

            expect(responseData).toEqual(mockResponse);
        });

        it('should return an undefined error message on a 500 response', function () {
            http.expectPOST(url.acceptInvitation).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;

            operatorInvitationService.acceptInvite(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error has occurred');
        });
    });

    describe("deleting an invitation", function () {

        it('should contain  an idNumber and reference provided to the payload then get the response', function () {
            http.expectPOST(url.deleteInvitation, invitation).respond(200, {},
                {
                    'x-sbg-response-code': '0000',
                    'x-sbg-response-type': 'SUCCESS'
                });

            var responseData;

            operatorInvitationService.deleteInvite(invitation)
                .then(function (response) {
                    responseData = response;
                });

            http.flush();

            expect(responseData).toEqual({});
        });

        it('should return an undefined error message on a 500 response', function () {
            http.expectPOST(url.deleteInvitation).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;

            operatorInvitationService.deleteInvite(invitation)
                .catch(function (error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error has occurred');
        });
    });
});