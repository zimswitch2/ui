describe('statements service', function () {
    var http, service, url, location, account, expectedRequest, actual, emailStatementPreference, test;

    beforeEach(module('refresh.statements.services', 'refresh.test', 'refresh.configuration'));

    beforeEach(inject(function (_StatementService_, _$httpBackend_, _URL_, $location, ServiceTest) {
        http = _$httpBackend_;
        service = _StatementService_;
        url = _URL_;
        test = ServiceTest;
        location = $location;

        test.spyOnEndpoint('getTransactions');
        account = {
            "accountFeature": [
                {
                    "feature": "BALANCE",
                    "value": true
                },
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                },
                {
                    "feature": "STATEMENT",
                    "value": true
                },
                {
                    "feature": "TRANSFERFROM",
                    "value": true
                },
                {
                    "feature": "TRANSFERTO",
                    "value": true
                },
                {
                    "feature": "VOUCHER_PURCHASE",
                    "value": true
                }
            ],
            "accountType": "CURRENT",
            "arrearStatus": false,
            "availableBalance": {
                "amount": 289379.6,
                "currency": "ZAR"
            },
            "branch": {
                "code": "27",
                "name": "BALLITO BRANCH"
            },
            "card": {
                "countryCode": null,
                "number": "4451215410004279",
                "type": null
            },
            "creditLimit": null,
            "currentBalance": {
                "amount": 289479.6,
                "currency": "ZAR"
            },
            "customName": "",
            "disposalAccount": "",
            "errorIndicator": false,
            "goal": {
                "amount": {
                    "amount": 0,
                    "currency": "ZAR"
                },
                "name": "",
                "targetDate": null
            },
            "holderName": null,
            "interestRate": null,
            "maturityDate": null,
            "minimumPaymentDue": null,
            "minimumPaymentDueDate": null,
            "nextInterestDue": {
                "amount": 0,
                "currency": "ZAR"
            },
            "nextInterestDueDate": null,
            "noticeAmount": null,
            "noticeDate": null,
            "noticeTerm": null,
            "openedDate": null,
            "overdraftAmount": {
                "amount": 0,
                "currency": "ZAR"
            },
            "overdraftBalance": {
                "amount": 0,
                "currency": "ZAR"
            },
            "primary": true,
            "productName": "ELITE",
            "remainingTerm": null,
            "totalInterestEarned": null,
            "totalLoanAmount": null,
            "unclearedAmount": {
                "amount": 100,
                "currency": "ZAR"
            },
            "formattedNumber": "08-144-462-1",
            "keyValueMetadata": [
                {
                    "key": "BDS_ACCOUNT_TYPE_CODE",
                    "value": "000"
                },
                {
                    "key": "BDS_ACCOUNT_TYPE",
                    "value": "CURRENT"
                },
                {
                    "key": "ACCOUNT_SUITE_ID",
                    "value": "DN"
                },
                {
                    "key": "ACCOUNT_STYLE",
                    "value": "OR5"
                },
                {
                    "key": "SOURCE_SYSTEM_ACCOUNT_TYPE_CODE",
                    "value": "000"
                }
            ],
            "name": "ELITE",
            "number": "81444621",
            "serialNumber": 0
        };
        expectedRequest = {
            account: account,
            statementType: "Provisional",
            pageNumber: 1,
            containerName: 'PA04004693344621',
            morePagesIndicator: 'Yes'
        };
        emailStatementPreference = {
            formalStatementPreferences: [
                {
                    bpId: '123456789',
                    account: account,
                    emailAddrActive: 'true',
                    emailAddrValidated: 'true',
                    emailAddress: 'someEmail@email.com',
                    initialEmailAddress: 'someOld@email.com',
                    password: 'password',
                    suppressInd: 'F'
                }
            ]
        };
        actual = null;
    }));

    describe('statement', function () {

        it('should retrieve provisional statement lines', function () {
            var expectedResponse = {
                "statementLines": [
                    {
                        "amount": {
                            "amount": -1,
                            "currency": "ZAR"
                        },
                        "narrative": "IB PAYMENT TO IB REFRESH          410004261",
                        "runningBalance": {
                            "amount": 6864.94,
                            "currency": "ZAR"
                        },
                        "transactionDate": "2014-05-05T22:00:00.000+0000",
                        "transactionType": "377"
                    },
                    {
                        "amount": {
                            "amount": 1000,
                            "currency": "ZAR"
                        },
                        "narrative": "IB PAYMENT FROM ASDF",
                        "runningBalance": {
                            "amount": 7987.94,
                            "currency": "ZAR"
                        },
                        "transactionDate": "2014-05-14T22:00:00.000+0000",
                        "transactionType": "379"
                    }
                ],
                "pageNumber": 1,
                "containerName": "PA04004693344621",
                "morePagesIndicator": "No",
                "keyValueMetadata": [],
                "stepUp": null
            };

            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.statement('Provisional', account, 1, 'PA04004693344621')
                .then(function (statementResponse) {
                    actual = statementResponse;
                });
            http.flush();

            expect(actual.statementLines).toEqual(expectedResponse.statementLines);
            expect(actual.pageNumber).toEqual(1);
            expect(actual.containerName).toEqual('PA04004693344621');
            expect(actual.morePagesIndicator).toEqual('No');
        });

        it('should use the statement type specified in the url for thirty day statements', function () {
            expectedRequest.statementType = 'Thirty';

            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.statement('Thirty', account, 1, 'PA04004693344621');
            http.flush();
        });

        it('should use the statement type specified in the url for sixty day statements', function () {
            expectedRequest.statementType = 'Sixty';

            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.statement('Sixty', account, 1, 'PA04004693344621');
            http.flush();
        });

        it('should use the statement type specified in the url for ninety day statements', function () {
            expectedRequest.statementType = 'Ninety';

            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.statement('Ninety', account, 1, 'PA04004693344621');
            http.flush();
        });

        it('should use the statement type specified in the url for one hundred eighty day statements', function () {
            expectedRequest.statementType = 'OneHundredEighty';

            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.statement('OneHundredEighty', account, 1, 'PA04004693344621');
            http.flush();
        });

        it('should default the statement type to provisional if a disallowed value is specified in the url', function () {
            expectedRequest.statementType = 'Provisional';

            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.statement('Hacking', account, 1, 'PA04004693344621');
            http.flush();
        });

        it('should reject response if there is an application error', function () {
            http.expectPOST(url.paginatedStatements, expectedRequest).respond(200, {
                'x-sbg-response-code': 'non-zero',
                'x-sbg-response-type': 'ERROR'
            });
            service.statement('Provisional', account, 1, 'PA04004693344621')
                .catch(function (error) {
                    actual = error;
                });
            http.flush();

            expect(actual).toEqual({message: 'An error has occurred'});
        });
    });

    describe('get transactions', function () {
        var statementResponse = {
            statementLines: []
        };

        var request = {
            numberOfDays: undefined,
            account: {
                accountType: 'CREDIT_CARD'
            },
            pageNumber: 1,
            containerName: 'some container',
            firstLoad: true,
            pagingRequired: true,
            morePagesIndicator: 'Yes',
            currentDate: '2016'
        };

        it('should return a response when the headers return a success', function () {
            test.stubResponse('getTransactions', 200, {statementResponse: statementResponse}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            var gatewayRequest = {
                account: request.account,
                pageNumber: request.pageNumber,
                containerName: request.containerName,
                firstLoad: request.firstLoad,
                statementType: 'Thirty',
                pagingRequired: true,
                morePagesIndicator: 'Yes',
                sortCriteria: 'Normal',
                currentDate: request.currentDate
            };
            expect(service.getTransactions(request)).toBeResolvedWith({statementResponse: statementResponse});
            test.resolvePromise();
            expect(test.endpoint('getTransactions')).toHaveBeenCalledWith(gatewayRequest);
        });

        it('should reject with message from service endpoint when with error in header', function () {
            test.stubResponse('getTransactions', 200, {}, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'some message'
            });
            expect(service.getTransactions(request)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not successful and no error message', function () {
            test.stubRejection('getTransactions', 501);
            expect(service.getTransactions(request)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });
    });

    describe('formal statement preferences', function () {

        it('should get the current selected account formal statement preferences', function () {
            var expectedResponse = emailStatementPreference;
            var card = {};

            expectedRequest = {
                accountNumber: account.number,
                cardNumber: card.number
            };
            http.expectPOST(url.formalStatementPreference, expectedRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            service.formalStatementPreference(card, account)
                .then(function (statementResponse) {
                    actual = statementResponse;
                });
            http.flush();

            expect(actual).toEqual(expectedResponse);
        });

        it('should reject when there is an error', function () {
            var expectedResponse = emailStatementPreference;
            var card = {};

            expectedRequest = {
                accountNumber: account.number,
                cardNumber: card.number
            };
            http.expectPOST(url.formalStatementPreference, expectedRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '1234',
                'x-sbg-response-type': 'ERROR'
            });
            service.formalStatementPreference(card, account)
                .catch(function (error) {
                    actual = error;
                });
            http.flush();

            expect(actual).toEqual({message: 'An error has occurred'});
        });

    });

    describe('save formal statement preferences', function () {

        beforeEach(function () {

            expectedRequest = {
                "cardNumber": "123456789",
                "formalStatementPreferences": [
                    {
                        "account": {
                            "number": "81444621"
                        },
                        "emailAddress": "someEmail@email.com",
                        "emailAddrActive": "true",
                        "emailAddrValidated": "true"
                    }
                ]
            };
        });

        it('should save the formal statement preferences', function () {

            var request = emailStatementPreference.formalStatementPreferences[0];

            request['card'] = {number: '123456789'};
            http.expectPOST(url.editFormalStatementPreference, expectedRequest).respond(200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            service.editFormalStatementPreference(request).then(function (response) {
                actual = response;
            });
            http.flush();
            expect(actual).toEqual({});
        });

        it('should reject when there is an error', function () {
            var expectedResponse = {};

            var request = emailStatementPreference.formalStatementPreferences[0];

            request['card'] = {number: '123456789'};

            http.expectPOST(url.editFormalStatementPreference, expectedRequest).respond(200, expectedResponse, {
                'x-sbg-response-code': '1234',
                'x-sbg-response-type': 'ERROR'
            });
            service.editFormalStatementPreference(request)
                .catch(function (error) {
                    actual = error;
                });
            http.flush();

            expect(actual).toEqual({message: 'An error has occurred'});
        });
    });

    describe('getStatementTypesForAccount', function () {

        it('should return statement types for credit card', function () {
            account.accountType = 'CREDIT_CARD';
            var statementTypes = [
                {value: 'Provisional', description: 'Latest transactions'},
                {value: 'Thirty', description: 'Previous month'},
                {value: 'Sixty', description: 'Two months ago'},
                {value: 'Ninety', description: 'Three months ago'}
            ];

            expect(service.getStatementTypesForAccount(account.accountType)).toEqual(statementTypes);
        });

        it('should return statement types for everything else which is not credit card', function () {
            var statementTypes = [
                {value: 'Provisional', description: 'Latest transactions'},
                {value: 'Thirty', description: '30 days'},
                {value: 'Sixty', description: '60 days'},
                {value: 'Ninety', description: '90 days'},
                {value: 'OneHundredEighty', description: '180 days'}
            ];

            expect(service.getStatementTypesForAccount('Everything else')).toEqual(statementTypes);
        });
    });
});
