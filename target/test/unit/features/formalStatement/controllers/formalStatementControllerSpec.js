describe('Unit Test - formal statement controller', function () {
    beforeEach(module('refresh.formalStatement.controller'));

    describe('routing', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should associate controller with url', function () {
            expect(route.routes['/formal-statements'].controller).toEqual('FormalStatementController');
        });

        it('should associate template with url', function () {
            expect(route.routes['/formal-statements'].templateUrl).toEqual('features/formalStatement/partials/formalStatements.html');
        });
    });

    describe('controller', function () {
        var accounts = [
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "12-34-567-890-0",
                "availableBalance": {"amount": 9000.0},
                accountType: "CURRENT",
                number: 'accountBeingUsed',
                branch: {}
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": {"amount": 10000.0},
                accountType: "CREDIT_CARD"
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": false
                    }
                ],
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": {"amount": 10000.0},
                accountType: "HOME_LOAN"
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "11-31-117-890-0",
                "availableBalance": {"amount": 1000.0},
                accountType: "CURRENT",
                number: 'accountBeingUsed',
                branch: {}
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "11-31-217-890-0",
                "availableBalance": {"amount": 1000.0},
                accountType: "OTHER",
                number: '100001131217890',
                branch: {}
            }
        ];

        var statement = [
            {
                StatementPeriod: '1 April 2014',
                StatementDescription: 'Who cares',
                FileSize: 'Whatever',
                TransactionId: '0121212'
            }
        ];
        var scope, controller, accountsService, card, mock, formalStatementService, digitalId, timeout;

        var initController = function () {
            controller('FormalStatementController', {
                $scope: scope,
                AccountsService: accountsService,
                Card: card,
                FormalStatementService: formalStatementService,
                DigitalId: digitalId,
                $timeout: timeout
            });
        };

        beforeEach(inject(function ($rootScope, $controller, _mock_, $timeout) {
            scope = $rootScope.$new();
            controller = $controller;
            mock = _mock_;
            digitalId = jasmine.createSpyObj('DigitalId', ['current']);
            digitalId.current.and.returnValue({username: 'ZuluCoda'});
            timeout = $timeout;

            formalStatementService = jasmine.createSpyObj('FormalStatementService', ['viewFormalStatementList', 'emailFormalStatement']);
            formalStatementService.viewFormalStatementList.and.returnValue(mock.resolve(statement));
            formalStatementService.emailFormalStatement.and.returnValue(mock.resolve({}));

            accountsService = jasmine.createSpyObj('AccountsService', ['list']);
            accountsService.list.and.returnValue(mock.resolve({accounts: accounts}));

            card = jasmine.createSpyObj('Card', ['current', 'anySelected']);
            card.current.and.returnValue({number: '12345'});
        }));

        describe('initialize', function () {
            beforeEach(function () {
                initController();
                scope.$digest();
            });

            it('should retrieve accounts', function () {
                expect(accountsService.list).toHaveBeenCalledWith({number: '12345'});
            });

            it('should set current accounts on the scope', function () {
                expect(scope.accounts).toEqual([accounts[0], accounts[1], accounts[2], accounts[3]]);
            });

            it('should call formal statement service', function () {
                expect(formalStatementService.viewFormalStatementList).toHaveBeenCalledWith(accounts[0].number, accounts[0].accountType, {number: '12345'});
            });

            it('should set formal statement on the scope', function () {
                expect(scope.formalStatements).toEqual(statement);
            });

            it('should set the first account as the selected account', function () {
                expect(scope.selectedAccount).toEqual(scope.accounts[0]);
            });

            it('should set digital id as default email address', function () {
                expect(digitalId.current).toHaveBeenCalled();
                expect(scope.emailAddress).toEqual('ZuluCoda');
            });

            it('should not set accounts when there are no accounts', function () {
                beforeEach(function () {
                    accountsService.list.and.returnValue(mock.resolve({accounts: [{
                        "accountFeature": [
                            {
                                "feature": "PAYMENTFROM",
                                "value": true
                            }
                        ],
                        "formattedNumber": "12-34-567-890-0",
                        "availableBalance": {"amount": 9000.0},
                        accountType: "SOMETHING ELSE",
                        number: 'accountBeingUsed',
                        branch: {}
                    }]}));
                    initController();
                    scope.$digest();
                });

                it('should not set accounts', function () {
                    expect(scope.accounts).toBeUndefined();
                });
            });
        });

        describe('no accounts', function () {
            beforeEach(function () {
                accountsService.list.and.returnValue(mock.resolve({accounts: []}));
                initController();
                scope.$digest();
            });

            it('should not set current account on the scope', function () {
                expect(scope.selectedAccount).toBeUndefined();
            });

            it('should not call formal statement', function () {
                expect(formalStatementService.viewFormalStatementList).not.toHaveBeenCalled();
            });
        });

        describe('changing an account', function () {
            var diff = {
                diff: 'this is diff'
            };
            var accountNumber = accounts[3].number;

            beforeEach(function () {
                initController();
                scope.$digest();
            });

            it('should call formal statement service', function () {
                scope.selectedAccount = accounts[3];

                scope.changeAccountTo();
                expect(formalStatementService.viewFormalStatementList).toHaveBeenCalledWith(accounts[3].number, accounts[0].accountType, {number: '12345'});
            });

            it('should set formal statement on the scope', function () {
                scope.selectedAccount = accounts[3];

                formalStatementService.viewFormalStatementList.and.returnValue(mock.resolve(diff));
                scope.changeAccountTo();
                scope.$digest();
                expect(scope.formalStatements).toEqual(diff);
            });

        });

        describe('download', function () {
            beforeEach(function () {
                initController();
                scope.$digest();
            });

            it('should set download statement and download url when open download modal', function () {
                var downloadStatement = {accountStatementId: 'id'};
                var expectedFormItems = [
                    {
                        name: 'cardNumber',
                        value: '12345'
                    },
                    {
                        name: 'statementId',
                        value: downloadStatement.accountStatementId
                    },
                    {
                        name: 'accountNumber',
                        value: accounts[0].number
                    },
                    {
                        name: 'accountType',
                        value: accounts[0].accountType
                    }
                ];
                scope.openDownloadModal(downloadStatement);
                expect(scope.downloadUrl).toBe('/sbg-ib/rest/StatementService/DownloadFormalStatement');
                expect(scope.downloadFormalStatement).toEqual(expectedFormItems);
                expect(scope.isDownloadModalOpen).toBeTruthy();
            });

            it('should set download statement to undefined when close download modal', function () {
                var downloadStatement = {accountStatementId: 'id'};
                scope.openDownloadModal(downloadStatement);
                expect(scope.isDownloadModalOpen).not.toBeUndefined();

                scope.closeDownloadModal();
                timeout.flush();
                expect(scope.isDownloadModalOpen).toBeUndefined();
            });
        });

        describe('email', function () {
            var emailStatement;

            beforeEach(function () {
                initController();
                scope.$digest();
                emailStatement = {accountStatementId: 'id', statementTimeFrame: {
                    startDate: 'start date'
                }};
            });

            it('should set email statement', function () {
                var expectedEmailStatement = emailStatement;
                scope.openEmailModal(emailStatement);
                expect(scope.emailFormalStatement).toEqual(expectedEmailStatement);
                expect(scope.isEmailModalOpen).toBeTruthy();
            });

            it('should set email statement to undefined when close email modal', function () {
                scope.openEmailModal(emailStatement);
                expect(scope.isEmailModalOpen).not.toBeUndefined();

                scope.closeEmailModal();
                expect(scope.isEmailModalOpen).toBeUndefined();
            });

            it('should call email formal statement service', function () {
                var cardNumber = '12345', statementId = emailStatement.accountStatementId,
                    accountNumber = accounts[0].number, emailAddress = 'test@email.com', accountType = accounts[0].accountType;

                spyOn(scope, 'closeEmailModal').and.callThrough();

                scope.emailFormalStatement = emailStatement;
                scope.emailAddress = emailAddress;
                scope.isEmailModalOpen = true;
                scope.emailStatement();
                scope.$digest();
                expect(formalStatementService.emailFormalStatement).toHaveBeenCalledWith(
                    cardNumber, statementId, accountNumber, accountType, emailAddress);
                expect(scope.isSuccessful).toBeTruthy();
                expect(scope.errorMessage).toBeUndefined();
                expect(scope.closeEmailModal).toHaveBeenCalled();
                expect(scope.isEmailModalOpen).toBeUndefined();
            });

            it('should set digital id as default email address', function () {
                var emailAddress = 'will-i-am';
                scope.emailAddress = emailAddress;
                scope.openEmailModal(emailStatement);
                scope.$digest();
                expect(scope.emailAddress).toEqual(emailAddress);
                scope.closeDownloadModal();
                scope.openEmailModal(emailStatement);
                expect(scope.emailAddress).toEqual(emailAddress);
            });
        });

        describe('service error', function () {
            var errorMessage = 'Life is good ... for now';

            describe('view formal statement service', function () {
                it('should set error message on the scope for account list', function () {
                    accountsService.list.and.returnValue(mock.reject(errorMessage));
                    initController();
                    scope.$digest();
                    expect(scope.errorMessage).toEqual(errorMessage);
                });

                it('should set error message on the scope for formal statement', function () {
                    formalStatementService.viewFormalStatementList.and.returnValue(mock.reject(errorMessage));
                    initController();
                    scope.$digest();
                    expect(scope.errorMessage).toEqual(errorMessage);
                });
            });

            describe('email formal statement service', function () {
                it('should set error message on the scope for email statement', function () {
                    formalStatementService.emailFormalStatement.and.returnValue(mock.reject(errorMessage));
                    initController();
                    scope.$digest();

                    spyOn(scope, 'closeEmailModal').and.callThrough();

                    scope.emailFormalStatement = {};
                    scope.isEmailModalOpen = true;
                    scope.emailStatement();
                    scope.$digest();
                    expect(scope.errorMessage).toEqual(errorMessage);
                    expect(scope.isSuccessful).toBeFalsy();
                    expect(scope.closeEmailModal).toHaveBeenCalled();
                    expect(scope.isEmailModalOpen).toBeUndefined();
                });
            });
        });
    });

    describe('formalStatementFilter', function () {
        beforeEach(module('refresh.formalStatement.controller', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));
        var formalStatements, filter;

        beforeEach(inject(function ($filter) {
            filter = $filter;
            formalStatements = [
                {
                    accountStatementId: "22554",
                    statementFileSize: 32,
                    statementTimeFrame: {
                        startDate: "2015-09-01T00:00:00.000+0000",
                        endDate: "2015-09-30T00:00:00.000+0000"
                    }
                },
                {
                    accountStatementId: "22555",
                    statementFileSize: 322,
                    statementTimeFrame: {
                        startDate: "2015-08-01T00:00:00.000+0000",
                        endDate: "2015-08-31T00:00:00.000+0000"
                    }
                },
                {
                    accountStatementId: "22556",
                    statementFileSize: 324,
                    tatementTimeFrame: {
                        startDate: "2015-07-01T00:00:00.000+0000",
                        endDate: "2015-07-31T00:00:00.000+0000"
                    }
                }
            ];
        }));

        it('should filter by the start date', function () {
            expect(filter('formalStatementFilter')(formalStatements, '1 september')).toEqual([formalStatements[0]]);
        });

        it('should filter by the end date', function () {
            expect(filter('formalStatementFilter')(formalStatements, '31 aug')).toEqual([formalStatements[1]]);
        });

    });
});