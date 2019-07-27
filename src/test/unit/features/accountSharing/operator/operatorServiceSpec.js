describe('OperatorService', function() {
    beforeEach(module('refresh.accountSharing.operator'));

    var http, url, cardSpy, listSpy, operatorService, systemPrincipalIdentifiers, serviceError, user, rootScope, mock;
    var currentSystemPrincipalIdentifiers = {
        "systemPrincipalIdentifiers": {
            "systemPrincipalId": "123132",
            "systemPrincipalKey": "SED"
        }
    };

    var operatorId = 2;

    var idNumber = "8001011967189";

    var operatorRequest = {
        "operatorId": 2,
        "systemPrincipalIdentifier": {
            "systemPrincipalKey": "SED",
            "systemPrincipalId": "123132"
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


    beforeEach(inject(function(OperatorService, Card, AccountsService, _$httpBackend_, _URL_, _ServiceError_, _User_, _$rootScope_, _mock_) {
        operatorService = OperatorService;
        http = _$httpBackend_;
        url = _URL_;
        serviceError = _ServiceError_;
        user = _User_;
        rootScope = _$rootScope_;
        mock = _mock_;
        cardSpy = spyOn(Card, ['current']);
        listSpy = spyOn(AccountsService, 'list');

        cardSpy.and.returnValue({
            number: 'number'
        });

        listSpy.and.returnValue(mock.resolve({
            accounts: [{
                number: "302490448"
            }]
        }));

        spyOn(user, 'principal').and.returnValue(currentSystemPrincipalIdentifiers);
        spyOn(user, 'principalForCurrentDashboard');
    }));



    describe('operators', function() {
        describe('with successful service response', function() {
            describe('fetch operators', function() {
                var operators = [{
                    "id": 2,
                    "active": true,
                    "userDetails": {
                        "firstName": "Louise",
                        "surname": "Smith",
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
                }];

                beforeEach(function() {
                    http.expectPOST(url.getOperatorsForBusiness, currentSystemPrincipalIdentifiers).respond(200, {
                        operators: operators
                    }, {
                        'x-sbg-response-code': '0000',
                        'x-sbg-response-type': 'SUCCESS'
                    });

                    http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                        'x-sbg-response-code': '0000',
                        'x-sbg-response-type': 'SUCCESS'
                    });
                });

                describe('operator list fetch', function() {
                    it('should contain the systemPrincipalIdentifiers return by the User service then get the response', function() {
                        var responseData;

                        operatorService.getOperators()
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toEqual([{
                            "id": 2,
                            "active": true,
                            "userDetails": {
                                "firstName": "Louise",
                                "surname": "Smith",
                                "idNumber": "8001011967189",
                                "cellPhone": {
                                    "cellPhoneNumber": "0831234567",
                                    "countryCode": "ZA",
                                    "internationalDialingCode": "27"
                                }
                            },
                            "permissions": [{
                                "role": {
                                    "id": "1",
                                    "name": "View",
                                    "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                                },
                                "accountReference": {
                                    "number": "302490448"
                                }
                            }]
                        }]);
                    });
                });

                describe('check operator already exists by idNumber', function() {
                    it('should return true if operator with provided idNumber already exists', function() {
                        var responseData;

                        operatorService.operatorExists(idNumber)
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toEqual(true);
                    });
                    it('should return false if operator with provided idNumber does not exists', function() {
                        var responseData;

                        operatorService.operatorExists("00000000000000000")
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toEqual(false);
                    });
                });

                describe('operator by id', function() {
                    it('should return a single operator when a valid id is passed', function() {
                        var responseData;

                        operatorService.getOperator(2)
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toEqual({
                            "id": 2,
                            "active": true,
                            "userDetails": {
                                "firstName": "Louise",
                                "surname": "Smith",
                                "idNumber": "8001011967189",
                                "cellPhone": {
                                    "cellPhoneNumber": "0831234567",
                                    "countryCode": "ZA",
                                    "internationalDialingCode": "27"
                                }
                            },
                            "permissions": [{
                                "role": {
                                    "id": "1",
                                    "name": "View",
                                    "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                                },
                                "accountReference": {
                                    "number": "302490448"
                                }
                            }]
                        });
                    });

                    it('should return undefined when an invalid id is passed', function() {
                        var responseData;

                        operatorService.getOperator(9999)
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toBeUndefined();
                    });
                });
            });

            describe('fetch pending operators', function() {
                var pendingOperators = [{
                    "id": 2,
                    "active": true,
                    "referenceNo" : "1234567890",
                    "status" : "Pending",
                    "userDetails": {
                        "firstName": "Louise",
                        "surname": "Smith",
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
                }];

                describe('pending operator list fetch', function() {
                    it('should contain the systemPrincipalIdentifiers return by the User service then get the response', function() {

                        http.expectPOST(url.getPendingOperatorsForBusiness, currentSystemPrincipalIdentifiers).respond(200, {
                            operators: pendingOperators
                        }, {
                            'x-sbg-response-code': '0000',
                            'x-sbg-response-type': 'SUCCESS'
                        });

                        http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                            'x-sbg-response-code': '0000',
                            'x-sbg-response-type': 'SUCCESS'
                        });

                        var responseData;

                        operatorService.getPendingOperators()
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toEqual([{
                            "id": 2,
                            "active": true,
                            "referenceNo" : "1234567890",
                            "status" : "Pending",
                            "userDetails": {
                                "firstName": "Louise",
                                "surname": "Smith",
                                "idNumber": "8001011967189",
                                "cellPhone": {
                                    "cellPhoneNumber": "0831234567",
                                    "countryCode": "ZA",
                                    "internationalDialingCode": "27"
                                }
                            },
                            "permissions": [{
                                "role": {
                                    "id": "1",
                                    "name": "View",
                                    "description": "View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor."
                                },
                                "accountReference": {
                                    "number": "302490448"
                                }
                            }]
                        }]);
                    });

                    it('should return an error when an unknown error occurs ', function () {
                        http.expectPOST(url.getPendingOperatorsForBusiness, currentSystemPrincipalIdentifiers).respond(200, {}, {
                            'x-sbg-response-code': '9999',
                            'x-sbg-response-type': 'ERROR',
                            'x-sbg-response-message': 'An error has occurred'
                        });

                        http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                            'x-sbg-response-code': '0000',
                            'x-sbg-response-type': 'SUCCESS'
                        });

                        var errorMessage;

                        operatorService.getPendingOperators()
                            .catch(function (error) {
                                errorMessage = error.message;
                            });

                        http.flush();

                        expect(errorMessage).toEqual('An error has occurred');
                    });

                    it('should return a single operator when a valid id number is passed', function() {

                        http.expectPOST(url.getPendingOperatorsForBusiness, currentSystemPrincipalIdentifiers).respond(200, {
                            operators: pendingOperators
                        }, {
                            'x-sbg-response-code': '0000',
                            'x-sbg-response-type': 'SUCCESS'
                        });

                        http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                            'x-sbg-response-code': '0000',
                            'x-sbg-response-type': 'SUCCESS'
                        });

                        var responseData;

                        operatorService.getPendingOperator("8001011967189")
                            .then(function(response) {
                                responseData = response;
                            });
                        http.flush();

                        expect(responseData).toEqual(
                            {
                                id: 2,
                                active: true,
                                referenceNo: '1234567890',
                                status: 'Pending',
                                userDetails: Object({
                                    firstName: 'Louise',
                                    surname: 'Smith',
                                    idNumber: '8001011967189',
                                    cellPhone: Object({
                                        cellPhoneNumber: '0831234567',
                                        countryCode: 'ZA',
                                        internationalDialingCode: '27'
                                    })
                                }),
                                permissions: [Object({
                                    role: Object({
                                        id: '1',
                                        name: 'View',
                                        description: 'View Only - can view all transactions on the entity. This role would typically be assigned to the accountant or the auditor.'
                                    }), accountReference: Object({number: '302490448'})
                                })]
                            });
                    });
                });

                describe('re invite operator', function() {
                    it('should return blank body on success', function () {

                        var currentPrincipal = {
                            systemPrincipalIdentifier: {
                                systemPrincipalKey: 'SED',
                                systemPrincipalId: '123132'
                            }
                        };

                        var userDetails = {
                            idNumber: "8001011967189"
                        };

                        var referenceNumber="1234500000";

                        user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                        var expectedRequest = {
                            systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                            idNumber: userDetails.idNumber,
                            referenceNumber : referenceNumber
                        };

                        var expectedResponse = {};

                        http.expectPUT(url.reInviteOperator, expectedRequest).respond(200, expectedResponse, {
                            'x-sbg-response-code': '0000',
                            'x-sbg-response-type': 'SUCCESS'
                        });

                        var responseData;

                        operatorService.reInviteOperator(idNumber, referenceNumber)
                            .then(function (response) {
                                responseData = response.data;
                            });

                        http.flush();

                        expect(responseData).toEqual(expectedResponse);
                    });

                    it('should return an invitation not found message on a 9005 response', function() {

                        var currentPrincipal = {
                            systemPrincipalIdentifier: {
                                systemPrincipalKey: 'SED',
                                systemPrincipalId: '123132'
                            }
                        };

                        var userDetails = {
                            idNumber: "8001011967189"
                        };

                        var referenceNumber = "1234500000";

                        user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                        var expectedRequest = {
                            systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                            idNumber: userDetails.idNumber,
                            referenceNumber : referenceNumber
                        };

                        http.expectPUT(url.reInviteOperator, expectedRequest).respond(200, {}, {
                                'x-sbg-response-code': '9005',
                                'x-sbg-response-type': 'ERROR',
                                'x-sbg-response-message': 'Invitation not found.'
                            }
                        );

                        var errorMessage;

                        operatorService.reInviteOperator(idNumber, referenceNumber)
                            .catch(function(error) {
                                errorMessage = error.message;
                            });

                        http.flush();

                        expect(errorMessage).toEqual('Invitation not found.');
                    });

                    it('should return a generic error message on a 9999 response', function() {

                        var currentPrincipal = {
                            systemPrincipalIdentifier: {
                                systemPrincipalKey: 'SED',
                                systemPrincipalId: '123132'
                            }
                        };

                        var userDetails = {
                            idNumber: "8001011967189"
                        };

                        var referenceNumber = "1234500000";

                        user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                        http.expectPUT(url.reInviteOperator).respond(200, {}, {
                                'x-sbg-response-code': '9999',
                                'x-sbg-response-type': 'ERROR',
                                'x-sbg-response-message': 'some error.'
                            }

                        );

                        var errorMessage;

                        operatorService.reInviteOperator(userDetails.idNumber, referenceNumber)
                            .catch(function(error) {
                                errorMessage = error.message;
                            });

                        http.flush();

                        expect(errorMessage).toEqual('some error.');
                    });

                    it('should return an undefined error message on a 500 response', function() {

                        var currentPrincipal = {
                            systemPrincipalIdentifier: {
                                systemPrincipalKey: 'SED',
                                systemPrincipalId: '123132'
                            }
                        };

                        var userDetails = {
                            idNumber: "8001011967189"
                        };

                        var referenceNumber = "1234500000";

                        user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                        http.expectPUT(url.reInviteOperator).respond(500, {
                            "transactionResults": [{
                                "responseCode": {
                                    "code": "1234",
                                    "responseType": "ERROR",
                                    "message": "some error"
                                }
                            }]
                        });

                        var errorMessage;

                        operatorService.reInviteOperator(userDetails.idNumber, referenceNumber)
                            .catch(function(error) {
                                errorMessage = error.message;
                            });

                        http.flush();

                        expect(errorMessage).toEqual('An error occurred.');
                    });
                });
            });

            describe('update operator', function() {
                var userDetails = {
                    id: 2
                };
                beforeEach(function() {
                    var currentPrincipal = {
                        systemPrincipalIdentifier: {
                            systemPrincipalId: 1,
                            systemPrincipalKey: 'SED'
                        }
                    };

                    user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                    var expectedRequest = {
                        systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                        operatorId: userDetails.id
                    };

                    http.expectPUT(url.updateOperator, expectedRequest).respond(200, {}, {
                        'x-sbg-response-code': '0000',
                        'x-sbg-response-type': 'SUCCESS'
                    });
                });

                it('should return operator on success', function() {
                    var expectedResponse = {};

                    var responseData;

                    operatorService.updateOperator(userDetails)
                        .then(function(response) {
                            responseData = response;
                        });
                    http.flush();

                    expect(responseData).toEqual(expectedResponse);
                });
            });

            describe('updateOperatorPermissions', function () {
                var operator = {
                    id: 2,
                    userDetails: {
                        name: 'Joanna'
                    },
                    permissions: [{
                        accountReference: {
                            number: '12345'
                        },
                        role: {
                            id: 1,
                            name: 'view'
                        }
                    }]
                };
                beforeEach(function() {
                    var currentPrincipal = {
                        systemPrincipalIdentifier: {
                            systemPrincipalId: 1,
                            systemPrincipalKey: 'SED'
                        }
                    };

                    user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                    var expectedRequest = {
                        systemPrincipalIdentifier: currentPrincipal.systemPrincipalIdentifier,
                        operatorId: operator.id,
                        permissions: operator.permissions

                    };

                    http.expectPUT(url.updateOperatorPermissions, expectedRequest).respond(200, {}, {
                        'x-sbg-response-code': '0000',
                        'x-sbg-response-type': 'SUCCESS'
                    });
                });

                it('should return operator on success', function() {
                    var expectedResponse = {};

                    var responseData;

                    operatorService.updateOperatorPermissions(operator)
                        .then(function(response) {
                            responseData = response;
                        });
                    http.flush();

                    expect(responseData).toEqual(expectedResponse);
                });
            });
        });

        describe('service error', function() {
            beforeEach(function() {
                var currentPrincipal = {
                    systemPrincipalIdentifier: {
                        systemPrincipalId: 1,
                        systemPrincipalKey: 'SED'
                    }
                };

                user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

                http.expectPOST(url.getOperatorsForBusiness, currentSystemPrincipalIdentifiers).respond(500, {
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

            });

            it('should return an undefined error message on a 500 response', function() {
                var errorMessage;
                operatorService.getOperators()
                    .catch(function(error) {
                        errorMessage = error.message;
                    });
                http.flush();

                expect(errorMessage).toEqual('An error has occurred');
            });
        });

    });


    describe('roles fetch', function() {
        it('should get a list of roles from the sbg-rest api', function() {
            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(200, rolesResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var responseData;
            operatorService.roles()
                .then(function(response) {
                    responseData = response;
                });
            http.flush();

            expect(responseData).toEqual([{
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
            }]);
        });

        it('should return an error message on a 500 response', function() {
            http.expectPOST(url.getRolesForContext, currentSystemPrincipalIdentifiers).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;
            operatorService.roles()
                .catch(function(error) {
                    errorMessage = error.message;
                });
            http.flush();

            expect(errorMessage).toEqual('Error fetching permission list');
        });
    });


    describe("deleting an operator", function() {

        it('should contain the operator id and systemPrincipalIdentifiers then get the response', function() {
            var expectedResponse = {};

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPOST(url.deleteOperator, operatorRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var responseData;

            operatorService.deleteOperator(operatorId)
                .then(function(response) {
                    responseData = response.data;
                });

            http.flush();

            expect(responseData).toEqual(expectedResponse);
        });

        it('should return an operator doesn\'t exist message on a 9005 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPOST(url.deleteOperator).respond(200, {}, {
                    'x-sbg-response-code': '9005',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'Operator doesn\'t exist.'
                }

            );

            var errorMessage;

            operatorService.deleteOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('Operator doesn\'t exist.');
        });

        it('should return a generic error message on a 9999 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPOST(url.deleteOperator).respond(200, {}, {
                    'x-sbg-response-code': '9999',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'some error.'
                }

            );

            var errorMessage;

            operatorService.deleteOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('some error.');
        });

        it('should return an undefined error message on a 500 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPOST(url.deleteOperator).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;

            operatorService.deleteOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error occurred.');
        });
    });

    describe("deactivating an operator", function() {

        it('should contain the operator id and systemPrincipalIdentifiers then get the response', function() {
            var expectedResponse = {};

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPUT(url.deactivateOperator, operatorRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var responseData;

            operatorService.deactivateOperator(operatorId)
                .then(function(response) {
                    responseData = response.data;
                });

            http.flush();

            expect(responseData).toEqual(expectedResponse);
        });

        it('should return an operator doesn\'t exist message on a 9005 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPUT(url.deactivateOperator).respond(200, {}, {
                'x-sbg-response-code': '9005',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Operator doesn\'t exist.'
            });

            var errorMessage;

            operatorService.deactivateOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('Operator doesn\'t exist.');
        });

        it('should return a generic error message on a 9999 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPUT(url.deactivateOperator).respond(200, {}, {
                    'x-sbg-response-code': '9999',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'some error.'
                }

            );

            var errorMessage;

            operatorService.deactivateOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('some error.');
        });

        it('should return an undefined error message on a 500 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPUT(url.deactivateOperator).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;

            operatorService.deactivateOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error occurred.');
        });
    });


    describe("activating an operator", function() {

        it('should contain the operator id and systemPrincipalIdentifiers then get the response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            var expectedResponse = {};

            http.expectPUT(url.activateOperator, operatorRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var responseData;

            operatorService.activateOperator(operatorId)
                .then(function(response) {
                    responseData = response.data;
                });

            http.flush();

            expect(responseData).toEqual(expectedResponse);
        });

        it('should return an operator doesn\'t exist message on a 9005 response', function() {
            http.expectPUT(url.activateOperator).respond(200, {}, {
                'x-sbg-response-code': '9005',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Operator doesn\'t exist.'
            });

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            var errorMessage;

            operatorService.activateOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('Operator doesn\'t exist.');
        });

        it('should return a generic error message on a 9999 response', function() {
            http.expectPUT(url.activateOperator).respond(200, {}, {
                    'x-sbg-response-code': '9999',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'some error.'
                }

            );

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);


            var errorMessage;

            operatorService.activateOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('some error.');
        });

        it('should return an undefined error message on a 500 response', function() {

            var currentPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalKey: 'SED',
                    systemPrincipalId: '123132'
                }
            };

            user.principalForCurrentDashboard.and.returnValue(currentPrincipal);

            http.expectPUT(url.activateOperator).respond(500, {
                "transactionResults": [{
                    "responseCode": {
                        "code": "1234",
                        "responseType": "ERROR",
                        "message": "some error"
                    }
                }]
            });

            var errorMessage;

            operatorService.activateOperator(operatorId)
                .catch(function(error) {
                    errorMessage = error.message;
                });

            http.flush();

            expect(errorMessage).toEqual('An error occurred.');
        });
    });
});
